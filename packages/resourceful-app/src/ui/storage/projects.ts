import { Maybe, Project, Resource } from '../../lib'
import { observable, computed, action, toJS } from 'mobx'
import { makeProject } from '../lib/project'
import { IpcClient, upgradeResource } from '../lib'

let store: Maybe<ProjectsStore>

export class ProjectsStore {
  @observable private _projects: Project[] = []

  static create(): ProjectsStore {
    return store ?? (store = new this())
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public findResourceById(id: string): Maybe<Resource> {
    return this.currentProject.resources.find((r) => r.id === id)
  }

  @computed public get currentProject(): Project {
    const p = this._projects.find((p) => p.selected)

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

  private async saveProject(p: Project): Promise<boolean> {
    const res = await IpcClient.saveProject(p)

    if (res) {
      return true
    } else {
      console.error(`Failed saving project:`, p.name)
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

  @action public async deleteResource(resource: Resource): Promise<void> {
    const cp = this.currentProject
    if (cp) {
      const pos = cp.resources.findIndex((r) => r.id === resource.id)

      if (pos > -1) {
        const rest = [...cp.resources]
        rest.splice(pos, 1)
        cp.resources = rest

        await this.saveCurrentProject()
      }
    }
  }

  @action public async loadProjects(): Promise<void> {
    const ps = await IpcClient.loadProjets()

    if (ps) {
      ps.forEach((pp) => pp.resources.forEach((rr) => upgradeResource(rr)))

      console.log(`pp:`, ps)

      if (ps.length && !ps.find((p) => p.selected)) {
        console.log(`No selected project from disk`)
        ps[0].selected = true
        await this.saveProject(ps[0])
        console.log(`Saved project as selected`)
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
}
