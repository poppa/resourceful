import React, { FC, useState } from 'react'
import { observer } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import { DialogContent, DialogActions, Button } from '@material-ui/core'
import { editResourceDialogState, projectsStore } from '../../storage'
import ResourceFormComponent from './ResourceForm'
import { deserialize } from '../../../lib/ipc/client'
import { Resource } from '../../../lib/interfaces/resource'

interface LocalState {
  org?: Resource
}

const EditResourceDialog: FC = observer(() => {
  const s = editResourceDialogState

  const [state, setState] = useState<LocalState>({
    org: undefined,
  })

  if (s.resource && state.org?.id !== s.resource?.id) {
    setState({ org: deserialize(s.resource) })
  }

  const cancelCallback = (): void => {
    if (state.org?.id !== s.resource?.id) {
      throw new Error('State resource id !== resource id')
    }

    if (state.org && s.resource) {
      for (const [k, v] of Object.entries(state.org)) {
        if (s.resource[k] !== v) {
          s.resource[k] = v
        }
      }
    }

    s.isOpen = false
    setState({ org: undefined })
  }

  const onKeyEnter = async (): Promise<void> => {
    setState({ org: undefined })
    await projectsStore.saveCurrentProject()
    s.isOpen = false
  }

  return (
    <Dialog
      open={s.isOpen}
      maxWidth="sm"
      fullWidth={true}
      onClose={(_, reason): void => {
        if (reason === 'escapeKeyDown') {
          cancelCallback()
        }
      }}
      onKeyDown={(e): void => {
        if (e.which === 13) {
          onKeyEnter()
        }
      }}
    >
      <DialogTitle>Edit resource</DialogTitle>
      <DialogContent>
        <ResourceFormComponent resource={s.resource} />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelCallback} color="default">
          Cancel
        </Button>
        <Button onClick={onKeyEnter} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default EditResourceDialog