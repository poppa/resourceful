import { Maybe, Project } from '../../lib'
import { observable, computed, action } from 'mobx'

let store: Maybe<ProjectsStore>

export class ProjectsStore {
  @observable private _projects: Project[] = [
    { id: '1', name: 'Daily', selected: true },
    { id: '2', name: 'Bygg' },
    { id: '3', name: 'Kommunal Rapport' },
  ]

  static create(): ProjectsStore {
    return store ?? (store = new this())
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  @computed public get projects(): Project[] {
    return this._projects
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
