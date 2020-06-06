import React, { FC } from 'react'
import Tabs from './Tabs/Tabs'
import { Project } from '../../../lib'
import ProjectComponent from './Project/Project'
import { staticStore, projectsStore } from '../../storage'

const handleDrop = async (e: React.DragEvent): Promise<void> => {
  console.log(`Got drop dude:`, e.dataTransfer.files)
  e.preventDefault()
  e.stopPropagation()

  const files = e.dataTransfer.files

  for (const file of files) {
    await projectsStore.resolveResource(file.path)
  }
}

const handleDragOver = (e: React.DragEvent): void => {
  e.preventDefault()
  // console.log(`Drag over:`, e)
}

const handleDragEnter = (e: React.DragEvent): void => {
  console.log(`Drag enter:`, e)
  e.dataTransfer.dropEffect = 'file'
}

const handleDragLeave = (e: React.DragEvent): void => {
  console.log(`Drag leave:`, e)
}

const handleDragExit = (e: React.DragEvent): void => {
  console.log(`Drag Exit:`, e)
}

export interface ProjectProps {
  projects: Project[]
}

const ProjectsComponent: FC<ProjectProps> = (props): JSX.Element => {
  console.log(`Runtime info:`, staticStore.appRuntimeInfo)
  return (
    <>
      <Tabs projects={props.projects} />
      <div
        className="workspace"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragExit={handleDragExit}
        onDrop={handleDrop}
      >
        <ProjectComponent project={props.projects.find((p) => p.selected)} />
      </div>
    </>
  )
}

export default ProjectsComponent
