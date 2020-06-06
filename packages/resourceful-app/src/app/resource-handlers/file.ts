import { ResolveResourceArgs } from '../../lib/ipc/types'
import { Resource, Maybe, ResourceType, FileResource } from '../../lib'
import { logDebug } from '../../lib/debug'
import { fileExists, isDir } from '../lib/async-fs'
import { makeResource } from '../lib/resource'
import { basename } from 'path'
import { lookup } from 'mime-types'

const debug = logDebug('resolve-file-resource')

export async function handler({
  buffer,
  project,
}: ResolveResourceArgs): Promise<Maybe<Resource>> {
  if (buffer.startsWith('/') || buffer.startsWith('file:')) {
    if (await fileExists(buffer)) {
      debug(`Resolve File:`, buffer, project.name)
      const isdir = await isDir(buffer)
      const mime = isdir.result ? 'directory' : lookup(buffer) ?? 'unknown'

      const resource = makeResource({
        type: ResourceType.File,
        name: basename(buffer),
        path: buffer,
        contentType: mime,
      } as FileResource)

      console.log(`Resource:`, resource)

      return resource
    }
  }

  return undefined
}
