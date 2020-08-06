import React, { FC } from 'react'
import { observer } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import { DialogContent, DialogActions, Button } from '@material-ui/core'
import { createProjectDialogState } from '../../storage'
import CreateProjectComponent from './CreateProject'
import { Maybe } from '../../../lib'

export type OnCreateCallback = () => Promise<boolean>

const CreateProjectDialog: FC = observer(() => {
  const s = createProjectDialogState

  let onSubmit: Maybe<() => Promise<boolean>>
  const fire = (fn: OnCreateCallback): void => {
    onSubmit = fn
  }

  const onKeyEnter = async (): Promise<void> => {
    if (onSubmit && (await onSubmit())) {
      s.isOpen = false
    }
  }

  return (
    <Dialog
      open={s.isOpen}
      maxWidth="xs"
      fullWidth={true}
      onClose={(_, reason): void => {
        if (reason === 'escapeKeyDown') {
          s.isOpen = false
        }
      }}
      onKeyDown={(e): void => {
        if (e.which === 13) {
          onKeyEnter()
        }
      }}
    >
      <DialogTitle>Create project</DialogTitle>
      <DialogContent>
        <CreateProjectComponent onCreate={fire} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => {
            s.isOpen = false
          }}
          color="default"
        >
          Cancel
        </Button>
        <Button onClick={onKeyEnter} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default CreateProjectDialog
