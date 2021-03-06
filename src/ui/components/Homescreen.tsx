import React from 'react'
import { createProjectDialogState } from '../storage'

const Homescreen = (): JSX.Element => {
  return (
    <div className="homescreen">
      <div
        className="homescreen__wrapper"
        onClick={(): void => {
          createProjectDialogState.isOpen = true
        }}
      >
        <div className="homescreen__flash">Create A Project</div>
        <div className="homescreen__text">
          You don&apos;t seem to have any projects created yet.
        </div>
        <div className="homescreen__text">Click here to create your first</div>
      </div>
    </div>
  )
}

export default Homescreen
