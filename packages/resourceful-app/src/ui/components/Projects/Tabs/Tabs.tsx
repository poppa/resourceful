import React, { FC } from 'react'
import { Project } from '../../../../lib'
import { ProjectProps } from '../Projects'
import { projectsStore } from '../../../storage'

interface TabProps {
  selected?: boolean
}

const Tab: FC<Project & TabProps> = (p): JSX.Element => {
  return (
    <button
      className={`tab${p.selected ? ' tab__selected' : ''}`}
      onClick={(): void => projectsStore.activate(p)}
    >
      {p.name}
    </button>
  )
}

const Tabs: FC<ProjectProps> = (props): JSX.Element => {
  return (
    <div className="tabs">
      <div className="tabs__projects">
        {props.projects.map((p) => (
          <Tab
            name={p.name}
            id={p.id}
            key={`tab-${p.id}`}
            selected={p.selected}
          />
        ))}
      </div>
      <div className="tabs__actions">
        <button className="tab tab__action tabs__action-config">c</button>
        <button className="tab tab__action tabs__action-new-project">+</button>
      </div>
    </div>
  )
}

export default Tabs
