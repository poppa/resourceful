import Result, { failure } from 'safe-result'
import { downloadUrl, WebPage, DownloadData } from '../lib/download'
import { Resource, ResourceType, Maybe } from '../../lib'
import { ResolveResourceArgs } from '../../lib/ipc/types'
import { logDebug } from '../../lib/debug'
import { makeResource, makeResourceDir } from '../lib/resource'
import { writeFile } from '../lib/async-fs'
import { join } from 'path'

const protocols = ['http://', 'https://', 'ftp://']

const debug = logDebug('resolve-resource')

interface AssetDownload {
  key: string
  data: Result.Result<DownloadData>
}

export async function wrapDownload(
  key: string,
  url: string
): Promise<AssetDownload> {
  return {
    key,
    data: await downloadUrl(url),
  }
}

export async function handler({
  buffer,
  project,
}: ResolveResourceArgs): Promise<Maybe<Resource>> {
  if (protocols.some((p) => buffer.startsWith(p))) {
    debug(`Web resource, downloading %s`, buffer)

    const res = await downloadUrl(buffer)

    if (res.success) {
      const data = res.result as WebPage
      const resource = makeResource({
        type: ResourceType.Url,
        name: data.title,
        contentType: 'text/html',
      })

      const x: Array<Promise<AssetDownload>> = []

      if (data.icon) {
        debug('Downloading icon')
        x.push(wrapDownload('icon', data.icon))
      }

      if (data.image) {
        debug('Downloading image')
        x.push(wrapDownload('image', data.image))
      }

      if (x.length) {
        const xrs = await Result.all(x)

        if (xrs.success) {
          debug(
            'Got assets results:',
            xrs.result.map((rr) => rr.key)
          )

          const rdir = await makeResourceDir(resource, project)

          debug('Resource dir is:', rdir)

          if (rdir) {
            const wres = xrs.result.map(async (file) => {
              const d = file.data.result

              if (d) {
                const name = `${file.key}${d.extension ?? ''}`
                return writeFile(join(rdir, name), d.data, {
                  encoding: 'binary',
                })
              } else {
                return failure(file.data.error)
              }
            })

            const rr = await Result.allSettled(wres)
            debug('Result of saves:', rr.unwrap())
          }
        } else if (xrs.error) {
          debug('Some assets failed:', xrs.error)
          console.error(`Error downloading resource assets:`, xrs.error)
        }
      }

      debug(`Save to project: %O`, project)

      return resource
    }
  } else {
    debug(`Not a web resource`)
  }

  return undefined
}
