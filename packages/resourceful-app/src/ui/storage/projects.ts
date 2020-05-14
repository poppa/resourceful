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
    return this._projects
  }

  @computed public get hasProjects(): boolean {
    return this._projects.length > 0
  }

  @action public async createProject(p?: Project): Promise<Project> {
    p = p ?? makeProject()
    const mp = await IpcClient.createProject(p)
    this._projects.push(mp)
    this.activate(mp)
    return mp
  }

  public async loadProjects(): Promise<void> {
    return
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
