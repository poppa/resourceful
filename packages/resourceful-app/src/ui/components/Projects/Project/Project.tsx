import React, { FC } from 'react'
import { observer } from 'mobx-react'
import { Project } from '../../../../lib'
import ResourceComponent from '../../Resource/Resource'

const ProjectComponent: FC<{ project?: Project }> = observer(
  (props): JSX.Element | null => {
    if (!props.project) {
      return null
    }

    if (!props.project.resources.length) {
      return (
        <div className="homescreen">
          <div className="homescreen__wrapper">
            <div className="homescreen__flash">No resources</div>
            <div className="homescreen__text">
              You don&apos;t have any resources in this projects yet.
            </div>
            <div className="homescreen__text">
              Paste URLs, drag and drop a files and directories onto here to
              create them.
            </div>
          </div>
        </div>
      )
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
