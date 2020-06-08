import { observable, action } from 'mobx'
import { Maybe } from '../../lib/types/types'
import { Point } from '../../lib'

let store: Maybe<DragStateStore>

export class DragStateStore {
  static create(): DragStateStore {
    return store ?? (store = new this())
  }

  @observable public element: Maybe<Element>
  public mouseOffset: Maybe<Point>

  private constructor() {
    //
  }

  @action public clear(): void {
    this.element = undefined
    this.mouseOffset = undefined
  }
}
