import React, { FC } from 'react'
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
    <Dialog open={confirmState.isOpen}>
      {confirmState.state?.title ? <DialogTitle>The title</DialogTitle> : null}
      <DialogContent>
        <DialogContentText>{confirmState.state?.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => confirmState.state?.onAbort()}
          color="secondary"
        >
          Cancel
        </Button>
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
