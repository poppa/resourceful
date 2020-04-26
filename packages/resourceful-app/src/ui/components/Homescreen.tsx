import React from 'react'
import { pageStateStore } from '../storage'
import { PageState } from '../storage/pagestate'

const Homescreen = (): JSX.Element => {
  return (
    <div className="homescreen">
      <div
        className="homescreen__wrapper"
        onClick={(): number => (pageStateStore.state = PageState.Projects)}
      >
        <div className="homescreen__flash">Create A Project</div>
        <div className="homescreen_text">
          You don&apos;t seem to have any projects created yet.
        </div>
        <div className="homescreen_text">Click here to create your first</div>
      </div>
    </div>
  )
}

export default Homescreen
