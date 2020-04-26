import { observable } from 'mobx'
import { Maybe } from '../../lib/types/types'
import { isUndefined } from '../../lib/utils/typeguards'

let store: Maybe<PageStateStore>

export enum PageState {
  HomeScreen,
  Projects,
}

export function isPageState(n: Maybe<number>): boolean {
  if (isUndefined(n)) {
    return false
  }

  return [PageState.HomeScreen, PageState.Projects].includes(n)
}

export class PageStateStore {
  static create(): PageStateStore {
    return store ?? (store = new this())
  }

  @observable public state: PageState = PageState.HomeScreen

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
