import React, { FC } from 'react'
import { observer } from 'mobx-react'
import Popover from '@material-ui/core/Popover/Popover'
import List from '@material-ui/core/List/List'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ExpandIcon from '@material-ui/icons/ExpandMore'
import CollapseIcon from '@material-ui/icons/ExpandLess'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import {
  resourceActionsState,
  confirmState,
  projectsStore,
} from '../../storage'
import { Resource } from '../../../lib'
import { setResourceState } from '../../lib'

const CollapseItem: FC<{ resource?: Resource }> = observer(
  ({ resource }): JSX.Element | null => {
    if (!resource || !resource.state?.hasCard) {
      return null
    }

    if (resource.state?.collapsed) {
      return (
        <ListItem
          button={true}
          onClick={(): void => {
            setResourceState({
              resource,
              state: { collapsed: false },
              save: true,
            })
          }}
        >
          <ListItemIcon>
            <ExpandIcon />
            <ListItemText primary="Expand" />
          </ListItemIcon>
        </ListItem>
      )
    } else {
      return (
        <ListItem
          button={true}
          onClick={(): void => {
            setResourceState({
              resource,
              state: { collapsed: true },
              save: true,
            })
          }}
        >
          <ListItemIcon>
            <CollapseIcon />
            <ListItemText primary="Collapse" />
          </ListItemIcon>
        </ListItem>
      )
    }
  }
)

const handleDelete = (resource?: Resource): void => {
  console.log(`Handle Delete Resource:`, resource)
  confirmState.setState({
    description: `Are you sure you want to delete the ${resource?.name} resource?`,
    onAbort(): void {
      console.log(`Aborted`)
      confirmState.setState()
    },
    onConfirm(): void {
      confirmState.setState()
      if (resource) {
        projectsStore
          .deleteResource(resource)
          .catch((e) => console.error(`Delete resource error:`, e))
        resourceActionsState.toggleRef()
      }
    },
  })
}

const ResourceActions: FC = observer(() => {
  const el = resourceActionsState.ref?.current
  const res = resourceActionsState.resource

  return (
    <Popover
      anchorEl={el || null}
      open={!!el}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={(): void => resourceActionsState.toggleRef(undefined)}
    >
      <div className="resource-actions">
        <List component="nav">
          <CollapseItem resource={res} />
          <ListItem button>
            <ListItemIcon>
              <EditIcon />
              <ListItemText primary="Edit" />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={(): void => handleDelete(res)}>
            <ListItemIcon>
              <DeleteIcon />
              <ListItemText primary="Delete" />
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Popover>
  )
})

export default ResourceActions
