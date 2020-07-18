import React, { FC } from 'react'
import FormControl from '@material-ui/core/FormControl/FormControl'
import TextField from '@material-ui/core/TextField/TextField'

export interface State {
  isOk: boolean
  text?: string
}

export interface ProjectFormComponentProps {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
  value?: string
}

const ProjectFormComponent: FC<ProjectFormComponentProps> = ({
  state,
  setState,
  value,
}: ProjectFormComponentProps) => {
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
          defaultValue={value}
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

export default ProjectFormComponent
