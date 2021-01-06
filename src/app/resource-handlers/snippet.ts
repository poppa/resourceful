import type { ResolveResourceArgs } from '../../lib/ipc/types'
import type { Maybe, Resource, SnippetResource } from '../../lib'
import { ResourceType } from '../../lib'
import { makeResource } from '../lib/resource'

function isSourceCode(s: string): boolean {
  return s.length > 1 && s.includes('\n')
}

export async function handler({
  buffer,
}: ResolveResourceArgs): Promise<Maybe<Resource>> {
  if (isSourceCode(buffer)) {
    const r = makeResource({
      type: ResourceType.Text,
      name: buffer.substr(0, 15),
      contentType: 'text/plain',
      text: buffer,
      language: 'undefined',
    } as SnippetResource)

    return r
  }

  return undefined
}
