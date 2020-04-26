import React, { FC } from 'react'
import { observer } from 'mobx-react'
import { pageStateStore } from '../../storage'
import { withChildren } from '../../lib'
import { PageState } from '../../storage/pagestate'
import HomeScreen from '../Homescreen'

const PageStateComp: FC = observer(
  withChildren(
    (): JSX.Element => {
      switch (pageStateStore.state) {
        case PageState.HomeScreen:
          return <HomeScreen />

        case PageState.Projects:
          return <div>Projects man</div>

        default:
          return <div>Unknown page state</div>
      }
    }
  )
)

export default PageStateComp
