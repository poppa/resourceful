import React, { FC } from 'react'
import { observer } from 'mobx-react'
import { loginRedirectState } from '../storage'

const LoginWrapper: FC = observer(() => {
  if (loginRedirectState.location) {
    window.open(loginRedirectState.location.location)
  }

  return <></>
})

export default LoginWrapper
