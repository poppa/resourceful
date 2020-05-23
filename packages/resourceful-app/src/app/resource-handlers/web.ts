import { downloadUrl, WebPage } from '../lib/download'
import { Resource, ResourceType, Maybe } from '../../lib'
import { v4 } from 'uuid'
import { ResolveResourceArgs } from '../../lib/ipc/types'
import { logDebug } from '../../lib/debug'

const protocols = ['http://', 'https://', 'ftp://']

const debug = logDebug('resolve-resource')

export async function handler({
  buffer,
  project,
}: ResolveResourceArgs): Promise<Maybe<Resource>> {
  if (protocols.some((p) => buffer.startsWith(p))) {
    debug(`Web resource, downloading %s`, buffer)

    const res = await downloadUrl(buffer)

    if (res.success) {
      const data = res.result as WebPage
      const resource: Resource = {
        id: v4(),
        type: ResourceType.Url,
        name: data.title,
        contentType: 'text/html',
      }

      debug(`Save to project: %O`, project)

      return resource
    }
  } else {
    debug(`Not a web resource`)
  }

  return undefined
}
