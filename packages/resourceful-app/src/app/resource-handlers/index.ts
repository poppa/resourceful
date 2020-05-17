import { AsyncResult, success, failure } from 'safe-result'
import { Resource, ResourceType } from '../../lib'
import { handler as webHandler } from './web'

export async function resovleResource(buf: string): AsyncResult<Resource> {
  if (await webHandler(buf)) {
    return success({
      name: buf.substring(0, 10),
      type: ResourceType.Url,
      contentType: 'text/html',
    })
  }

  return failure(new Error('Unhandled resource'))
}
