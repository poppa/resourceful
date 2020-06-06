import React, { FC } from 'react'
import Tabs from './Tabs/Tabs'
import { Project } from '../../../lib'
import ProjectComponent from './Project/Project'
import { staticStore } from '../../storage'

export interface ProjectProps {
  projects: Project[]
}

const ProjectsComponent: FC<ProjectProps> = (props): JSX.Element => {
  console.log(`Runtime info:`, staticStore.appRuntimeInfo)
  return (
    <>
      <Tabs projects={props.projects} />
      <div className="workspace">
        <ProjectComponent project={props.projects.find((p) => p.selected)} />
      </div>
    </>
  )
}

export default ProjectsComponent
