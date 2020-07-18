import React, { FC, useState } from 'react'
import { observer } from 'mobx-react'
import { OnCreateCallback } from './CreateProjectDialog'
import ProjectForm, { State } from './ProjectForm'
import { Project } from '../../../lib'
import { projectsStore, pageStateStore } from '../../storage'
import { PageState } from '../../storage/pagestate'

interface Props {
  onEdited(fn: OnCreateCallback): void
  project?: Project
}

const EditProjectComponent: FC<Props> = observer(
  ({ onEdited, project }: Props): JSX.Element => {
    if (!project) {
      throw new Error('Project is undefined')
    }

    const [state, setState] = useState<State>({ isOk: false })

    const onSubmit = async (): Promise<boolean> => {
      console.log(`onSubmitEditCalled:`, state)

      if (state.isOk) {
        project.name = state.text
        await projectsStore.saveProjectAndUpdate(project)
        pageStateStore.set(PageState.Projects)
        return true
      } else {
        console.error('Not ok to submit')
        return false
      }
    }

    onEdited(onSubmit)

    return (
      <ProjectForm state={state} setState={setState} value={project?.name} />
    )
  }
)

export default EditProjectComponent
