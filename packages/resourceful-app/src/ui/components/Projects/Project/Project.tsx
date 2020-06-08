import React, { FC } from 'react'
import { Project } from '../../../../lib'
import ResourceComponent from '../../Resource/Resource'
import { observer } from 'mobx-react'

const ProjectComponent: FC<{ project: Project }> = observer(
  (props): JSX.Element => {
    console.log(`Project resources:`, props.project)
    return (
      <div className="canvas">
        {props.project.resources.map((res) => (
          <ResourceComponent key={res.id} resource={res} />
        ))}
      </div>
    )
  }
)

export default ProjectComponent
