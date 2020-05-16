import { Maybe, Project } from '../../lib'
import { observable, computed, action } from 'mobx'
import { makeProject } from '../lib/project'
import { IpcClient } from '../lib'

let store: Maybe<ProjectsStore>

export class ProjectsStore {
  @observable private _projects: Project[] = []

  static create(): ProjectsStore {
    return store ?? (store = new this())
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  @computed public get projects(): Project[] {
    return [...this._projects]
  }

  @computed public get hasProjects(): boolean {
    return this._projects.length > 0
  }

  @action public async createProject(p?: Project): Promise<boolean> {
    p = p ?? makeProject()

    const mp = await IpcClient.saveProject(p)

    if (mp) {
      const prev = this._projects.find((p) => p.selected)

      if (prev) {
        prev.selected = false
        // FIXME: Should we await here?
        IpcClient.saveProject(prev)
      }

      if (!mp.selected) {
        mp.selected = true
        await IpcClient.saveProject(mp)
      }

      this._projects.push(mp)
      this.activate(mp)
    }

    return !!mp
  }

  @action public async loadProjects(): Promise<void> {
    const ps = await IpcClient.loadProjets()

    if (ps) {
      if (ps.length && !ps.find((p) => p.selected)) {
        console.log(`No selected project from disk`)
        ps[0].selected = true
        await IpcClient.saveProject(ps[0])
        console.log(`Saved project as selected`)
      }

      this._projects = ps
    } else {
      console.error(`Failed loading projects`)
    }
  }

  @action public activate(p: Project): void {
    const cpy = [...this._projects]

    cpy.find((pp) => {
      if (pp.selected) {
        pp.selected = false
        return true
      }
      return false
    })

    cpy.find((pp) => {
      if (pp.id === p.id) {
        pp.selected = true
        return true
      }
      return false
    })

    this._projects = cpy
  }
}
