import { AsyncResult, success, failure } from 'safe-result'
import { Resource, Maybe } from '../../lib'
import { handler as webHandler } from './web'
import { handler as fileHandler } from './file'
import { ResolveResourceArgs } from '../../lib/ipc/types'
import { logDebug } from '../../lib/debug'

const debug = logDebug('resolve-resource')

const handlers = [webHandler, fileHandler]

export async function resovleResource(
  args: ResolveResourceArgs
): AsyncResult<Resource> {
  debug('resolveResource(%O)', args)

  for (const handler of handlers) {
    const resource: Maybe<Resource> = await handler(args)

    if (resource) {
      debug('resolveResource() resovled: %O', resource)
      return success(resource)
    } else {
      debug('Try next if such')
    }
  }

  return failure(new Error('Unhandled resource'))
}
