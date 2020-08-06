import React, { FC } from 'react'
import { observer } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import { DialogContent, DialogActions, Button } from '@material-ui/core'
import { editProjectDialogState } from '../../storage'
import { Maybe } from '../../../lib'
import EditProject from './EditProject'

export type OnEditedCallback = () => Promise<boolean>

const EditProjectDialog: FC = observer(() => {
  const s = editProjectDialogState

  let onSubmit: Maybe<() => Promise<boolean>>
  const fire = (fn: OnEditedCallback): void => {
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
      <DialogTitle>Edit project</DialogTitle>
      <DialogContent>
        <EditProject onEdited={fire} project={s.project} />
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default EditProjectDialog
