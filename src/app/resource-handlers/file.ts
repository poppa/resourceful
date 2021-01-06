import { basename } from 'path'
import { lookup } from 'mime-types'
import type { ResolveResourceArgs } from '../../lib/ipc/types'
import type { Resource, Maybe, FileResource } from '../../lib'
import { ResourceType } from '../../lib'
import { logDebug } from '../../lib/debug'
import { fileExists, isDir } from '../lib/async-fs'
import { makeResource } from '../lib/resource'
import {
  getMimeTypeFromKnownExtensions,
  getNameFromKnownFileType,
} from '../../lib/helpers'

const debug = logDebug('resolve-file-resource')

export async function handler({
  buffer,
  project,
}: ResolveResourceArgs): Promise<Maybe<Resource>> {
  if (buffer.startsWith('/') || buffer.startsWith('file:')) {
    if (await fileExists(buffer)) {
      debug(`Resolve File:`, buffer, project.name)
      const isdir = await isDir(buffer)
      const mime = isdir.result
        ? 'directory'
        : lookup(buffer) || getMimeTypeFromKnownExtensions(buffer)

      const resource = makeResource({
        type: ResourceType.File,
        name: (await getNameFromKnownFileType(buffer)) || basename(buffer),
        path: buffer,
        contentType: mime,
      } as FileResource)

      debug(`Resource:`, resource)

      return resource
    }
  }

  return undefined
}
