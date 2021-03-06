import type { FC } from 'react'
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import { observer } from 'mobx-react'
import { confirmState } from '../storage'

const Confirm: FC = observer(() => {
  return (
    <Dialog
      open={confirmState.isOpen}
      onClose={(_, reason): void => {
        if (reason === 'escapeKeyDown') {
          confirmState.state?.onAbort?.()
        }
      }}
      onKeyDown={(e): void => {
        if (e.which === 13) {
          confirmState.state?.onConfirm()
        }
      }}
    >
      {confirmState.state?.title ? (
        <DialogTitle>{confirmState.state?.title}</DialogTitle>
      ) : null}
      <DialogContent>
        <DialogContentText>{confirmState.state?.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {confirmState.state?.onAbort ? (
          <Button
            onClick={(): void => confirmState.state?.onAbort?.()}
            color="secondary"
          >
            Cancel
          </Button>
        ) : null}

        <Button
          onClick={(): void => confirmState.state?.onConfirm()}
          color="primary"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default Confirm
