import React, { FC, useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import { Project } from '../../../../lib'
import { ProjectProps } from '../Projects'
import { projectsStore, createProjectDialogState } from '../../../storage'

interface TabProps {
  project: Project
}

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
        console.log(`State on click:`, state)
        project.selected ? void 0 : projectsStore.activate(project)
      }}
      onDragStart={(e): void => {
        e.dataTransfer.effectAllowed = 'move'
        const x = e.currentTarget.offsetLeft
        const y = e.currentTarget.offsetTop
        console.log(`Drag start:`, x, y, state.node.current)

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
      onDragEnd={(e): void => {
        console.log(`Drag ended:`, e.clientX, e.clientY)
        setState({ ...state, isDragged: false })
      }}
      onDragEnter={(_e): void => {
        _e.preventDefault()

        if (!state.isDragged) {
          setState({ ...state, isDraggedOver: true })
        }
      }}
      onDragLeave={(_e): void => {
        _e.preventDefault()

        if (!state.isDragged) {
          setState({ ...state, isDraggedOver: false })
        }
      }}
      onDrop={(e): void => {
        console.log(`I was dropped on:`, e.currentTarget)
      }}
    >
      {project.name}
    </button>
  )
}

const Tabs: FC<ProjectProps> = (props): JSX.Element => {
  console.log(`Tabs rendered`)
  return (
    <div className="tabs">
      <div className="tabs__projects">
        {props.projects.map((p) => (
          <Tab project={p} key={`tab-${p.id}`} />
        ))}
      </div>
      <div className="tabs__actions">
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
