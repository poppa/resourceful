import Result, { failure, success } from 'safe-result'
import { downloadUrl, WebPage, DownloadData } from '../lib/download'
import { Resource, ResourceType, Maybe, ResourceAssets } from '../../lib'
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
        href: buffer,
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
        debug('Result of fetch:', xrs.unwrap())
        const successes = xrs.result?.filter((x) => x.data.success) ?? []

        if (successes.length) {
          debug(
            'Got assets results:',
            successes.map((rr) => rr.key)
          )

          const rdir = await makeResourceDir(resource, project)
          debug('Resource dir is:', rdir)

          if (rdir) {
            const wres = successes.map(async (file) => {
              const d = file.data.result

              if (d) {
                const name = `${file.key}${d.extension ?? ''}`
                const wok = await writeFile(join(rdir, name), d.data, {
                  encoding: 'binary',
                })

                if (wok.success) {
                  return success(name)
                } else {
                  return wok.error
                }
              } else {
                return failure(file.data.error)
              }
            })

            const rr = await Result.allSettled(wres)
            debug('Result of saves: %O <> %O', rr.result, rr.error)

            const assets: ResourceAssets = {}

            successes.forEach((v, i) => {
              if (rr.success && rr.result[i]) {
                assets[v.key as keyof ResourceAssets] = rr.result[i].toString()
              }
            })

            resource.assets = assets
          }
        } else if (xrs.error) {
          debug('Some assets failed, or didnt exist')
          // FIXME: Write to log here
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
