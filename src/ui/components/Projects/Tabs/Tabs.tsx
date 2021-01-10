import type { FC } from 'react'
import React, { useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import FavoriteIcon from '@material-ui/icons/Favorite'
import type { Project } from '../../../../lib'
import type { ProjectProps } from '../Projects'
import {
  projectsStore,
  createProjectDialogState,
  tabDragState,
} from '../../../storage'

interface TabProps {
  project: Project
}

// FIXME: Clean this up. There are superfluous properties here
interface TabState {
  node?: React.RefObject<HTMLButtonElement>
  x: number
  y: number
  initX: number
  initY: number
  isDragged: boolean
  isDraggedOver: boolean
}

const Tab: FC<TabProps> = ({ project }: TabProps): JSX.Element => {
  const [state, setState] = useState<TabState>({
    x: NaN,
    y: NaN,
    initX: NaN,
    initY: NaN,
    node: React.createRef<HTMLButtonElement>(),
    isDragged: false,
    isDraggedOver: false,
  })

  const classNames = ['tab', 'tab--project']

  if (project.selected) {
    classNames.push('tab__selected')
  }

  if (state.isDraggedOver) {
    classNames.push('tab--draggedover')
  }

  if (state.isDragged) {
    classNames.push('tab--dragged')
  }

  return (
    <button
      id={project.id}
      className={classNames.join(' ')}
      draggable={true}
      ref={state.node}
      onClick={(): void => {
        project.selected ? void 0 : projectsStore.activate(project)
      }}
      onDragStart={(e): void => {
        e.dataTransfer.effectAllowed = 'move'
        const x = e.currentTarget.offsetLeft
        const y = e.currentTarget.offsetTop
        tabDragState.element = e.currentTarget
        tabDragState.x = x

        setState({
          x,
          y,
          initX: x,
          initY: y,
          isDragged: true,
          isDraggedOver: false,
          node: state.node,
        })
      }}
      onDragEnd={(): void => {
        setState({ ...state, isDragged: false })
        tabDragState.clear()
      }}
      onDragEnter={(_e): void => {
        if (!state.isDragged) {
          setState({ ...state, isDraggedOver: true })
        }
      }}
      onDragLeave={(_e): void => {
        if (!state.isDragged) {
          setState({ ...state, isDraggedOver: false })
        }
      }}
      onDragOver={(e): void => {
        e.preventDefault()
      }}
      onDrop={(e): void => {
        setState({ ...state, isDraggedOver: false })

        if (tabDragState.element?.id === e.currentTarget.id) {
          return
        }

        if (!tabDragState.element) {
          throw new Error(`Expected tab drag state to contain an element`)
        }

        const after = e.currentTarget.offsetLeft > (tabDragState.x ?? 0)
        projectsStore.moveProjectTab({
          source: tabDragState.element.id,
          target: e.currentTarget.id,
          after,
        })
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
        <button
          className="tab tab__action tabs__action-favorites"
          onClick={(): void => {
            createProjectDialogState.isOpen = true
          }}
        >
          <FavoriteIcon fontSize="small" />
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
