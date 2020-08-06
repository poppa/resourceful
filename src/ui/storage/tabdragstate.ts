import { observable, action } from 'mobx'
import { Maybe } from '../../lib/types/types'

let store: Maybe<TabDragStateStore>

export class TabDragStateStore {
  static create(): TabDragStateStore {
    return store ?? (store = new this())
  }

  @observable public element: Maybe<Element>
  @observable public x: Maybe<number>

  private constructor() {
    //
  }

  @action public clear(): void {
    this.element = undefined
    this.x = undefined
  }
}
