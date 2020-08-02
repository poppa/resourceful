import React, { FC, useState, EventHandler, SyntheticEvent } from 'react'
import { observer } from 'mobx-react'
import {
  Resource,
  isWebResource,
  isFileResource,
  isSnippetResource,
  isTextResource,
  Point,
} from '../../../lib'
import {
  resolveDefaultFilePath,
  resolveProjectFilePath,
  getIconForResource,
  setResourceState,
  columns,
} from '../../lib'
import { projectsStore, dragStateStore } from '../../storage'

const { shell } = window.require('electron') as typeof import('electron')

export interface ResourceProps {
  resource: Resource
}

function handleOnStartDrag(e: React.DragEvent): void {
  const elem = e.currentTarget as HTMLDivElement
  console.log(`Start drag:`, elem)

  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.dropEffect = 'move'
  dragStateStore.element = e.currentTarget
  dragStateStore.mouseOffset = {
    x: e.clientX - elem.offsetLeft,
    y: e.clientY - elem.offsetTop,
  }
}

function handleOnDragEnd(e: React.DragEvent): void {
  console.log(`Drag end:`, e.currentTarget)
  dragStateStore.clear()
}

function onClick(r: Resource): void | boolean {
  if (isWebResource(r)) {
    shell.openExternal(r.href)
  } else if (isFileResource(r)) {
    shell.openItem(r.path)
  } else if (isSnippetResource(r) || isTextResource(r)) {
    return true
  }
}

function card(r: Resource): JSX.Element | null {
  if (isWebResource(r) && r.assets?.image) {
    if (!r.state?.hasCard) {
      setResourceState({ resource: r, state: { hasCard: true } })
    }
    const cp = projectsStore.currentProject
    const url = r.assets?.image
      ? resolveProjectFilePath(`${cp.id}/${r.id}/${r.assets.image}`)
      : resolveDefaultFilePath(`card.png`)
    return (
      <div className="resource__card">
        <img src={url} className="resource__card-image" draggable={false} />
      </div>
    )
  } else if (isFileResource(r)) {
    if (r.contentType.startsWith('image/')) {
      if (!r.state?.hasCard) {
        setResourceState({ resource: r, state: { hasCard: true } })
      }

      return (
        <div className="resource__file-image">
          <img
            src={r.path}
            className="resource__file-image--image"
            draggable={false}
          />
        </div>
      )
    }
  } else if (isSnippetResource(r)) {
    return (
      <div className={`resource__snippet`}>
        <div className={`resource__code`}>{r.text}</div>
      </div>
    )
  }

  return null
}

function icon(r: Resource): JSX.Element {
  const cp = projectsStore.currentProject
  const url = r.assets?.icon
    ? resolveProjectFilePath(`${cp.id}/${r.id}/${r.assets.icon}`)
    : undefined
  return (
    <div className="resource__icon">
      {url ? (
        <img src={url} className="resource__icon-image" />
      ) : (
        getIconForResource(r)
      )}
    </div>
  )
}

interface LocalState {
  isOpen: boolean
  prevPosition?: Point
}

const ResourceComponent: FC<ResourceProps> = observer((props) => {
  const r = props.resource
  const classlist = ['resource']
  const styles: React.CSSProperties = {}

  if (r.position) {
    classlist.push('resource--moved')
    styles.top = r.position.y
    styles.left = r.position.x
  }

  if (r.state?.collapsed) {
    classlist.push('resource--collapsed')
  }

  const [state, setState] = useState<LocalState>({
    isOpen: false,
    prevPosition: r.position,
  })

  if (
    state.prevPosition?.x !== r.position?.x ||
    state.prevPosition?.y !== r.position?.y
  ) {
    setState({ ...state, prevPosition: r.position })

    if (!state.isOpen) {
      // FIXME: This is a hack. We should probably make the columns stuff react
      //        on the resource position itself instead
      setTimeout(columns, 500)
    }
  }

  if (state.isOpen) {
    classlist.push('resource--opened')
  }

  const clickHandler = (): void => {
    const c = onClick(r)

    if (c) {
      setState({ isOpen: !state.isOpen })
    }
  }

  const dblClickHandler: EventHandler<SyntheticEvent> = (e): void => {
    const res = (e.target as HTMLElement).closest('.resource')

    if (res) {
      const t =
        res.querySelector('.resource__code') ||
        res.querySelector('.resource__text')

      if (t) {
        const range = document.createRange()
        range.selectNode(t)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
    }
  }

  return (
    <div
      className={classlist.join(' ')}
      style={styles}
      onClick={state.isOpen ? null : clickHandler}
      onDoubleClick={state.isOpen ? dblClickHandler : null}
      draggable={true}
      onDragStart={handleOnStartDrag}
      onDragEnd={handleOnDragEnd}
      id={r.id}
    >
      <div
        className="resource__header"
        onClick={state.isOpen ? clickHandler : null}
      >
        {icon(r)}
        <div className="resource__title">{r.name}</div>
      </div>
      {card(r)}
    </div>
  )
})

export default ResourceComponent
