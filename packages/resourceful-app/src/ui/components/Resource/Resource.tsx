import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Resource, isWebResource, isFileResource } from '../../../lib'
import {
  resolveDefaultFilePath,
  resolveProjectFilePath,
  getIconForResource,
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

@observer
export class ResourceComponent extends Component<ResourceProps> {
  public render(): JSX.Element {
    const r = this.props.resource
    const classlist = ['resource']
    const styles: React.CSSProperties = {}

    if (r.position) {
      classlist.push('resource--moved')
      styles.top = r.position.y
      styles.left = r.position.x
    }

    return (
      <div
        className={classlist.join(' ')}
        style={styles}
        onClick={(): void => this.onClick(r)}
        draggable={true}
        onDragStart={handleOnStartDrag}
        onDragEnd={handleOnDragEnd}
        id={r.id}
      >
        <div className="resource__header">
          {this.icon(r)}
          <div className="resource__title">{r.name}</div>
        </div>
        {this.card(r)}
      </div>
    )
  }

  private onClick(r: Resource): void {
    if (isWebResource(r)) {
      shell.openExternal(r.href)
    } else if (isFileResource(r)) {
      shell.openItem(r.path)
    }
  }

  private card(r: Resource): JSX.Element | null {
    if (isWebResource(r)) {
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
    }

    return null
  }

  private icon(r: Resource): JSX.Element {
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
}

export default ResourceComponent
