import { observable, action } from 'mobx'
import { RefObject } from 'react'
import { Maybe, Resource, Project } from '../../lib'

let resourceActionStore: Maybe<ResourceActionState>

export interface ToggleRefProps {
  ref?: RefObject<HTMLButtonElement>
  resource?: Resource
}

export class ResourceActionState {
  public static create(): ResourceActionState {
    return resourceActionStore ?? (resourceActionStore = new this())
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  @observable public ref: Maybe<RefObject<HTMLButtonElement>>
  @observable public resource: Maybe<Resource>

  @action public toggleRef(props: ToggleRefProps = {}): void {
    if (this.ref) {
      this.ref = undefined
      this.resource = undefined
    } else {
      this.ref = props.ref
      this.resource = props.resource
    }
  }
}

let confirmStore: Maybe<ConfirmState>

interface ConfirmStateData {
  title?: string
  description: string
  onConfirm(): void
  onAbort(): void
}

export class ConfirmState {
  public static create(): ConfirmState {
    return confirmStore ?? (confirmStore = new this())
  }

  @observable public state: Maybe<ConfirmStateData>
  @observable public isOpen = false

  @action public setState(state?: ConfirmStateData): void {
    if (state) {
      this.isOpen = true
      this.state = state
    } else {
      this.isOpen = false
      setTimeout(() => {
        this.state = undefined
      }, 200)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}

let createProjectDialogStore: Maybe<CreateProjectDialogState>

export class CreateProjectDialogState {
  public static create(): CreateProjectDialogState {
    return createProjectDialogStore ?? (createProjectDialogStore = new this())
  }

  @observable public isOpen = false
}

let editProjectDialogStore: Maybe<EditProjectDialogState>

export class EditProjectDialogState {
  public static create(): EditProjectDialogState {
    return editProjectDialogStore ?? (editProjectDialogStore = new this())
  }

  @observable public isOpen = false
  @observable public project?: Project

  @action setProject(proj?: Project): this {
    if (proj) {
      this.isOpen = true
      this.project = proj
    } else {
      this.isOpen = false
      this.project = undefined
    }

    return this
  }
}
