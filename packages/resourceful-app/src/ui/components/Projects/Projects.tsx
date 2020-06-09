import React, { FC } from 'react'
import Tabs from './Tabs/Tabs'
import { Project } from '../../../lib'
import ProjectComponent from './Project/Project'
import { staticStore, projectsStore, dragStateStore } from '../../storage'
import { handleMovedResource } from '../../lib'
import ResourceActions from '../Resource/ResourceActions'
import Confirm from '../Confirm'

const handleDrop = async (e: React.DragEvent): Promise<void> => {
  e.preventDefault()
  e.stopPropagation()

  if (dragStateStore.element) {
    console.log(`Drop is resource`)
    handleMovedResource({ element: dragStateStore.element, event: e })
    return
  }

  console.log(`Got file drop dude:`, e.dataTransfer.files)

  const files = e.dataTransfer.files

  // FIXME: Why does files not have an interator
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  for (const file of files) {
    await projectsStore.resolveResource(file.path)
  }
}

const handleDragOver = (e: React.DragEvent): void => {
  e.preventDefault()
}

const handleDragEnter = (e: React.DragEvent): void => {
  console.log(`Drag enter:`, e)

  if (dragStateStore.element) {
    e.dataTransfer.dropEffect = 'move'
  } else {
    e.dataTransfer.dropEffect = 'file'
  }
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
      <ResourceActions />
      <Confirm />
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
