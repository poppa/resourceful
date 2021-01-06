import type { Maybe, Project, Resource } from '../../lib'
import { observable, computed, action, toJS } from 'mobx'
import { makeProject } from '../lib/project'
import { IpcClient, upgradeResource } from '../lib'
import { pageStateStore } from '.'
import { PageState } from './pagestate'

let store: Maybe<ProjectsStore>

export class ProjectsStore {
  @observable private _projects: Project[] = []

  public static create(): ProjectsStore {
    return store ?? (store = new this())
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public findResourceById(id: string): Maybe<Resource> {
    return this.currentProject.resources.find((r) => r.id === id)
  }

  public findProjectById(id: string): Maybe<Project> {
    return this._projects.find((p) => p.id === id)
  }

  public findProjectIndexById(id: string): number {
    return this._projects.findIndex((p) => p.id === id)
  }

  @computed public get currentProject(): Project {
    const p = this._projects.find((pp) => pp.selected)

    if (!p) {
      throw new Error('No current project')
    }

    return p
  }

  @computed public get projects(): Project[] {
    return [...this._projects]
  }

  @computed public get hasProjects(): boolean {
    return this._projects.length > 0
  }

  @action public async moveProjectTab({
    after,
    source,
    target,
  }: {
    source: string
    target: string
    after: boolean
  }): Promise<void> {
    const sourceProject = this.findProjectById(source)

    if (!sourceProject) {
      throw new Error(`Unknown source project ${source}`)
    }

    const cpy: Project[] = []
    this._projects.forEach((p) => {
      if (p.id === target) {
        if (after) {
          cpy.push(p)
          cpy.push(sourceProject)
        } else {
          cpy.push(sourceProject)
          cpy.push(p)
        }
      } else if (p.id === source) {
        return
      } else {
        cpy.push(p)
      }
    })

    this._projects = cpy

    await IpcClient.saveProjectOrder(this._projects.map((p) => p.id))
  }

  @action public async resolveResource(buf: string): Promise<void> {
    console.log(`Resovle resource:`, buf)

    const r = await IpcClient.resovleResource({
      buffer: buf,
      project: toJS(this.currentProject),
    })

    if (r.success) {
      const cp = this.currentProject
      console.log(`Resource resolved successfully:`, r.result)
      cp.resources = [...cp.resources, r.result]
      await IpcClient.saveProject(this.currentProject)
    } else {
      console.error(`Failed creating resource:`, r.error)
    }
  }

  public async saveCurrentProject(): Promise<boolean> {
    if (this.currentProject) {
      return this.saveProject(this.currentProject)
    } else {
      console.debug(`No current project to save`)
    }

    return false
  }

  public async saveProject(p: Project): Promise<boolean> {
    const res = await IpcClient.saveProject(p)

    if (res) {
      return true
    } else {
      console.error(`Failed saving project:`, p.name)
    }

    return false
  }

  public async saveProjectAndUpdate(p: Project): Promise<boolean> {
    if (await this.saveProject(p)) {
      const idx = this.findProjectIndex(p)

      if (idx > -1) {
        const cpy = [...this.projects]
        cpy[idx] = p
        this._projects = cpy
        return true
      }
    }

    return false
  }

  @action public async createProject(p?: Project): Promise<boolean> {
    p = p ?? makeProject()

    const mp = await IpcClient.saveProject(p)

    if (mp) {
      this._projects.push(mp)
      this.activate(mp, true)
    }

    return !!mp
  }

  @action public async deleteProject(p: Project): Promise<boolean> {
    const r = await IpcClient.deleteProject(p)

    if (r.success && r.result === true) {
      const pos = this._projects.findIndex((pp) => pp.id === p.id)

      if (pos > -1) {
        const wasSelected = p.selected
        const cpy = [...this._projects]
        cpy.splice(pos, 1)

        if (wasSelected && cpy.length) {
          cpy[0].selected = true
        }

        this._projects = [...cpy]
      }

      if (!this._projects.length) {
        pageStateStore.set(PageState.HomeScreen)
      }

      return true
    } else {
      return false
    }
  }

  @action public async deleteResource(resource: Resource): Promise<void> {
    const cp = this.currentProject

    if (cp) {
      const pos = cp.resources.findIndex((r) => r.id === resource.id)

      if (pos > -1) {
        const rmres = await IpcClient.deleteResource(resource)

        if (!rmres) {
          // FIXME: Notify
          console.error(`Failed removing resource from disk`)
        }

        const rest = [...cp.resources]
        rest.splice(pos, 1)
        cp.resources = rest
        await this.saveCurrentProject()
      }
    }
  }

  @action public async loadProjects(): Promise<void> {
    const ps = await IpcClient.loadProjects()

    if (ps) {
      ps.forEach((pp) => pp.resources.forEach((rr) => upgradeResource(rr)))

      if (ps.length && !ps.find((p) => p.selected)) {
        ps[0].selected = true
        await this.saveProject(ps[0])
      }

      this._projects = ps
    } else {
      console.error(`Failed loading projects`)
    }
  }

  @action public activate(p: Project, save = true): void {
    const cpy = [...this._projects]

    cpy.find((pp) => {
      if (pp.selected) {
        pp.selected = false

        if (save) {
          this.saveProject(pp).catch((e) => console.error(`Crap1:`, e))
        }

        return true
      }

      return false
    })

    cpy.find((pp) => {
      if (pp.id === p.id) {
        pp.selected = true

        if (save) {
          this.saveProject(pp).catch((e) => console.error(`Crap2:`, e))
        }
        return true
      }
      return false
    })

    this._projects = cpy
  }

  private findProjectIndex(p: Project): number {
    return this.projects.findIndex((pp) => pp.id === p.id)
  }
}
