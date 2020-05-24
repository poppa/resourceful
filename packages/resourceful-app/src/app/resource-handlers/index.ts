import { AsyncResult, success, failure } from 'safe-result'
import { Resource, Maybe } from '../../lib'
import { handler as webHandler } from './web'
import { ResolveResourceArgs } from '../../lib/ipc/types'
import { logDebug } from '../../lib/debug'

const debug = logDebug('resolve-resource')

export async function resovleResource(
  args: ResolveResourceArgs
): AsyncResult<Resource> {
  debug('resolveResource(%O)', args)
  const resource: Maybe<Resource> = await webHandler(args)

  if (resource) {
    debug('resolveResource() resovled: %O', resource)
    return success(resource)
  }

  return failure(new Error('Unhandled resource'))
}
