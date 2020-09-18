import React, { FC } from 'react'
import { observer } from 'mobx-react'
import { pageStateStore, projectsStore } from '../../storage'
import { PageState } from '../../storage/pagestate'
import HomeScreen from '../Homescreen'
import Projects from '../Projects/Projects'
import CreateProjectDialog from '../Projects/CreateProjectDialog'
import EditProjectDialog from '../Projects/EditProjectDialog'
import EditResourceDialog from '../Resource/EditResourceDialog'

const PageStateComp: FC = observer(
  (): JSX.Element => {
    switch (pageStateStore.state) {
      case PageState.Initializing:
        return <div>Initializing...</div>

      case PageState.HomeScreen:
        return (
          <>
            <CreateProjectDialog />
            <HomeScreen />
          </>
        )

      case PageState.Projects:
        return (
          <>
            <CreateProjectDialog />
            <EditProjectDialog />
            <EditResourceDialog />
            <Projects projects={projectsStore.projects} />
          </>
        )

      default:
        return <div>Unknown page state</div>
    }
  }
)

export default PageStateComp
