import React, { FC } from 'react'
import { observer } from 'mobx-react'
import { Project } from '../../../../lib'
import ResourceComponent from '../../Resource/Resource'

const ProjectComponent: FC<{ project?: Project }> = observer(
  (props): JSX.Element | null => {
    if (!props.project) {
      return null
    }

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
