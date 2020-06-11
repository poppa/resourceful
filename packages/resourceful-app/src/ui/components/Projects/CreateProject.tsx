import React, { FC, useState } from 'react'
import FormControl from '@material-ui/core/FormControl/FormControl'
import TextField from '@material-ui/core/TextField/TextField'
import { makeProject } from '../../lib/project'
import { projectsStore, pageStateStore } from '../../storage'
import { observer } from 'mobx-react'
import { OnCreateCallback } from './CreateProjectDialog'
import { PageState } from '../../storage/pagestate'

interface State {
  isOk: boolean
  text?: string
}

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

    return (
      <form onSubmit={(e): void => e.preventDefault()}>
        <FormControl fullWidth={true}>
          <TextField
            required={true}
            error={!!(!state.isOk && state.text)}
            name="project-name"
            label="Project name"
            id="project-name"
            fullWidth={true}
            helperText={state.text && !state.isOk && 'Incorrect project name'}
            onInput={(e): void => {
              const v = (e.target as HTMLInputElement).value
              setState({
                text: v,
                isOk: v.length > 1,
              })
            }}
          />
        </FormControl>
      </form>
    )
  }
)

export default CreateProjectComponent
