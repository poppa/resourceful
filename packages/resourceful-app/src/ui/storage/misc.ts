import { observable, action, computed } from 'mobx'
import { RefObject } from 'react'
import { Maybe, Resource, Project, MaybeNull } from '../../lib'
import { FeedbackMessage, LoginRedirect } from '../../lib/ipc/types'

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

let editResourceDialogStore: Maybe<EditResourceDialogState>

export class EditResourceDialogState {
  public static create(): EditResourceDialogState {
    return editResourceDialogStore ?? (editResourceDialogStore = new this())
  }

  @observable public isOpen = false
  @observable public resource?: Resource

  @action setResource(resource?: Resource): this {
    if (resource) {
      this.isOpen = true
      this.resource = resource
    } else {
      this.isOpen = false
      this.resource = undefined
    }

    return this
  }
}

let createResourceStore: Maybe<CreateResourceState>

export class CreateResourceState {
  public static create(): CreateResourceState {
    return createResourceStore || (createResourceStore = new this())
  }

  private defaultDoneMessage = 'Done'

  @observable public isOpen = false
  @observable public messages: FeedbackMessage[] = []

  @action public clear(): void {
    this.messages = []
  }

  @computed public get length(): number {
    return this.messages.length
  }

  @computed public get message(): MaybeNull<string> {
    if (!this.messages.length) {
      return null
    }

    return this.messages[0]?.message || this.defaultDoneMessage
  }

  @action public add(message: FeedbackMessage): void {
    const old = this.messages.find((m) => m.key === message.key)

    if (old) {
      old.message = message.message

      if (message.type === 'finish') {
        setTimeout(() => {
          const pos = this.messages.findIndex((m) => m.key === message.key)

          if (pos > -1) {
            this.messages.splice(pos, 1)
          }
        }, 3000)
      }
    } else {
      this.messages = [message, ...this.messages]
    }
  }
}

let loginRedirectStore: Maybe<LoginRedirectState>

export class LoginRedirectState {
  public static create(): LoginRedirectState {
    return loginRedirectStore || (loginRedirectStore = new this())
  }

  @observable public location: Maybe<LoginRedirect>
}
