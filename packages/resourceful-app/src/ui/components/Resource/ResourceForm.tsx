import React, { FC } from 'react'
import {
  Resource,
  isFileResource,
  Maybe,
  isCmdResource,
  isWebResource,
  isTextResource,
} from '../../../lib'
import FormControl from '@material-ui/core/FormControl/FormControl'
import TextField from '@material-ui/core/TextField/TextField'

interface ResourceFormProps {
  resource: Resource
}

const ValueField: FC<ResourceFormProps> = ({ resource }) => {
  let defValue: Maybe<string>
  let label: Maybe<string>
  let type = 'text'

  if (isFileResource(resource)) {
    label = 'Path'
    defValue = resource.path
  } else if (isCmdResource(resource)) {
    label = 'Command'
    defValue = resource.cmd
  } else if (isWebResource(resource)) {
    label = 'Url'
    defValue = resource.href
    type = 'url'
  } else if (isTextResource(resource)) {
    label = 'Text'
    defValue = resource.text
  }

  return (
    <FormControl fullWidth={true}>
      <TextField
        required
        name="value"
        id="resource-value"
        label={label}
        type={type}
        defaultValue={defValue}
        onChange={(e): void => {
          const val = (e.target as HTMLInputElement).value
          if (isFileResource(resource)) {
            resource.path = val
          } else if (isCmdResource(resource)) {
            resource.cmd = val
          } else if (isWebResource(resource)) {
            resource.href = val
          } else if (isTextResource(resource)) {
            resource.text = val
          } else {
            throw new Error('Unhandled resource type')
          }
        }}
      />
    </FormControl>
  )
}

const ResourceFormComponent: FC<ResourceFormProps> = ({ resource }) => {
  console.log(`Resource:`, resource)
  return (
    <form onSubmit={(e): void => e.preventDefault()}>
      <FormControl fullWidth={true}>
        <TextField
          name="name"
          id="resource-name"
          label="Name"
          required={true}
          fullWidth={true}
          defaultValue={resource.name}
          onInput={(e): void => {
            const val = (e.target as HTMLInputElement).value
            resource.name = val
          }}
        />
      </FormControl>
      <ValueField resource={resource} />
      <FormControl fullWidth={true}>
        <TextField
          name="content-type"
          id="resource-content-type"
          label="Content type"
          required={true}
          fullWidth={true}
          defaultValue={resource.contentType}
          onInput={(e): void => {
            const val = (e.target as HTMLInputElement).value
            resource.contentType = val
          }}
        />
      </FormControl>
    </form>
  )
}

export default ResourceFormComponent
