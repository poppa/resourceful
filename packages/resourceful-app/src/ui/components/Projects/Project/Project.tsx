import React, { FC } from 'react'
import { Project } from '../../../../lib'

const ProjectComponent: FC<{ project: Project }> = (props): JSX.Element => {
  return <div className="canvas">{props.project.name}</div>
}

export default ProjectComponent
