import React, { FC } from 'react'
import { observer } from 'mobx-react'
import Snackbar from '@material-ui/core/Snackbar/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent'
import { createResourceState } from '../storage'
import { FeedbackMessage } from '../../lib/ipc/types'

const FeedbackMessage: FC = observer(() => {
  let message = createResourceState.message

  if (message && message.length > 50) {
    message = `${message.substr(0, 50)}...`
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={createResourceState.length > 0}
      autoHideDuration={3000}
      className={`feedback`}
    >
      <SnackbarContent message={message} />
    </Snackbar>
  )
})

export default FeedbackMessage
