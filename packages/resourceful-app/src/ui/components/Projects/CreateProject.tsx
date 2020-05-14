import React, { FC, useState } from 'react'
import FormControl from '@material-ui/core/FormControl/FormControl'
import TextField from '@material-ui/core/TextField/TextField'
import Button from '@material-ui/core/Button/Button'
import Container from '@material-ui/core/Container/Container'
import { makeProject } from '../../lib/project'
import { projectsStore, pageStateStore } from '../../storage'
import { observer } from 'mobx-react'
import { PageState } from '../../storage/pagestate'

interface State {
  isOk: boolean
  text?: string
}

const CreateProjectComponent: FC = observer(
  (): JSX.Element => {
    const [state, setState] = useState<State>({ isOk: false })

    return (
      <Container>
        <form
          onSubmit={(e): boolean => {
            e.preventDefault()
            if (state.isOk) {
              const p = makeProject({ name: state.text })
              projectsStore.createProject(p).then(() => {
                console.log(`Project done`)
                pageStateStore.set(PageState.Projects)
              })
              return false
            } else {
              console.error('Not ok to submit')
              return false
            }
          }}
        >
          <FormControl>
            <TextField
              required={true}
              error={!!(!state.isOk && state.text)}
              name="project-name"
              label="Project name"
              id="project-name"
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
          <FormControl>
            <Button variant="contained" color="primary">
              Create project
            </Button>
          </FormControl>
        </form>
      </Container>
    )
  }
)

export default CreateProjectComponent
