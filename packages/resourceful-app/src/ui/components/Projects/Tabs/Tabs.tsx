import React, { FC } from 'react'
import { Project } from '../../../../lib'
import { ProjectProps } from '../Projects'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import ConfigIcon from '@material-ui/icons/Build'
import { projectsStore, createProjectDialogState } from '../../../storage'

interface TabProps {
  project: Project
}

const Tab: FC<TabProps> = ({ project }: TabProps): JSX.Element => {
  return (
    <button
      id={project.id}
      className={`tab${project.selected ? ' tab__selected' : ''} tab--project`}
      onClick={(): void => {
        project.selected ? void 0 : projectsStore.activate(project)
      }}
    >
      {project.name}
    </button>
  )
}

const Tabs: FC<ProjectProps> = (props): JSX.Element => {
  return (
    <div className="tabs">
      <div className="tabs__projects">
        {props.projects.map((p) => (
          <Tab project={p} key={`tab-${p.id}`} />
        ))}
      </div>
      <div className="tabs__actions">
        <button className="tab tab__action tabs__action-config">
          <ConfigIcon fontSize="small" />
        </button>
        <button
          className="tab tab__action tabs__action-new-project"
          onClick={(): void => {
            createProjectDialogState.isOpen = true
          }}
        >
          <AddIcon fontSize="small" />
        </button>
      </div>
    </div>
  )
}

export default Tabs
