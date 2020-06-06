import React, { Component } from 'react'
import { Resource, isWebResource } from '../../../lib'
import { resolveDefaultFilePath, resolveProjectFilePath } from '../../lib'
import { projectsStore } from '../../storage'
import { observer } from 'mobx-react'

const { shell } = window.require('electron') as typeof import('electron')

export interface ResourceProps {
  resource: Resource
}

@observer
export class ResourceComponent extends Component<ResourceProps> {
  public render(): JSX.Element {
    const r = this.props.resource
    return (
      <div className="resource" onClick={(): void => this.onClick(r)}>
        <div className="resource__header">
          {this.icon(r)}
          <div className="resource__title">{r.name}</div>
        </div>
        {this.card(r)}
      </div>
    )
  }

  private onClick(r: Resource): void {
    console.log(`Got click:`, r)
    if (isWebResource(r)) {
      shell.openExternal(r.href)
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
          <img src={url} className="resource__card-image" />
        </div>
      )
    } else {
      return null
    }
  }

  private icon(r: Resource): JSX.Element {
    const cp = projectsStore.currentProject
    const url = r.assets?.icon
      ? resolveProjectFilePath(`${cp.id}/${r.id}/${r.assets.icon}`)
      : resolveDefaultFilePath(`type-${r.type}.png`)
    return (
      <div className="resource__icon">
        <img src={url} className="resource__icon-image" />
      </div>
    )
  }
}

export default ResourceComponent
