import React, { FC, useState } from 'react'
import { makeProject } from '../../lib/project'
import { projectsStore, pageStateStore } from '../../storage'
import { observer } from 'mobx-react'
import { OnCreateCallback } from './CreateProjectDialog'
import { PageState } from '../../storage/pagestate'
import ProjectForm, { State } from './ProjectForm'

interface Props {
  onCreate(fn: OnCreateCallback): void
}

const CreateProjectComponent: FC<Props> = observer(
  ({ onCreate }: Props): JSX.Element => {
    const [state, setState] = useState<State>({ isOk: false })

    const onSubmit = async (): Promise<boolean> => {
      console.log(`onSubmitCalled`)

      if (state.isOk) {
        const p = makeProject({ name: state.text })
        const res = await projectsStore.createProject(p)

        if (res) {
          if (pageStateStore.state !== PageState.Projects) {
            pageStateStore.set(PageState.Projects)
          }

          return true
        }

        return false
      } else {
        console.error('Not ok to submit')
        return false
      }
    }

    onCreate(onSubmit)

    return <ProjectForm state={state} setState={setState} />
  }
)

export default CreateProjectComponent
