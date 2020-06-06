import { AsyncResult, success, failure } from 'safe-result'
import axios, { AxiosError } from 'axios'
import cheerio from 'cheerio'
import { PlainObject, isPlainObject, Maybe } from '../../lib'
import { logDebug } from '../../lib/debug'

const debug = logDebug('download')

function getContentType(headers: PlainObject): string {
  if (headers['content-type']) {
    const ct = headers['content-type'] as string

    if (ct.includes(';')) {
      return ct.split(';')[0].trim()
    } else {
      return ct.trim()
    }
  }

  return 'text/plain'
}

function getCharset(headers: PlainObject): string {
  if (headers['content-type']) {
    const ct = headers['content-type'] as string
    const m = ct.match(/charset=(.+?)(\s|$)/)

    if (m) {
      return m[1]
    }
  }

  return 'utf-8'
}

function isAxiosError(o: unknown): o is AxiosError {
  return (
    o instanceof Error &&
    'isAxiosError' in o &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    o.isAxiosError === true
  )
}

interface Data {
  data: string
  extension?: string
}

interface PageMeta {
  title: string
  description?: string
  icon?: string
  image?: string
  contentType: string
}

function parseHtmlSnippet(html: string): PageMeta {
  const $ = cheerio.load(html)
  const meta = $('meta')

  const pageMeta: Partial<PageMeta> = {}

  meta.each((_, el) => {
    const attr = el.attribs

    if (attr.property === 'og:title') {
      pageMeta.title = attr.content
    } else if (attr.property === 'og:description') {
      pageMeta.description = attr.content
    } else if (attr.property === 'og:image') {
      pageMeta.image = attr.content
    } else if (!pageMeta.description && attr.name === 'description') {
      pageMeta.description = attr.value
    }
  })

  if (!pageMeta.title) {
    const ttl = $('title')
    ttl.each((_, el) => (pageMeta.title = el.nodeValue))
  }

  if (!pageMeta.title) {
    pageMeta.title = '<No title>'
  }

  const fav = $('link[rel="shortcut icon"]')

  if (fav.length) {
    pageMeta.icon = fav.attr('href')
  } else {
    const licon = $('link[rel="icon"]')

    if (licon.length) {
      let topSize = 0

      licon.each((_, el) => {
        const s = el.attribs.sizes
        if (s) {
          const nt = parseInt(s, 10)
          console.log(`Parsed size:`, nt)

          if (nt > topSize) {
            topSize = nt
            pageMeta.icon = el.attribs.href
          }
        }
      })
    }
  }

  if (!pageMeta.icon) {
    pageMeta.icon = '/favicon.ico'
  }

  debug(`Resolved page meta: %O`, pageMeta)
  return pageMeta as PageMeta
}

export type WebPage = Data & PageMeta
export type DownloadData = Data | WebPage

export function isWebPage(o: unknown): o is WebPage {
  return isPlainObject(o) && 'data' in o && 'title' in o
}

function extensionFromFileName(file: string): Maybe<string> {
  const m = file.match(/.+(\.[a-z0-9]+)($|\?)/i)

  if (m) {
    return m[1]
  }

  return undefined
}

export async function downloadUrl(url: string): AsyncResult<DownloadData> {
  try {
    debug(`Begin dowload:`, url)
    const x = await axios.get(url, {
      responseType: 'arraybuffer',
    })

    if (x.status / 100 === 2) {
      const ct = getContentType(x.headers || {})
      const cs = getCharset(x.headers)

      debug(`Downloaded:`, x.status, ct, cs, typeof x.data)

      if (ct === 'text/html') {
        const metadata = parseHtmlSnippet(x.data)

        if (metadata.icon && !metadata.icon.startsWith('http')) {
          metadata.icon = new URL(metadata.icon, url).toString()
          debug('Relative Icon converted:', metadata.icon)
        }
        metadata.contentType = 'text/html'
        return success({ ...metadata, data: x.data })
      } else {
        debug(`Non-HTML content type`)
      }

      return success({ data: x.data, extension: extensionFromFileName(url) })
    } else {
      throw new Error(`Non-200 response ${x.status} ${x.statusText}`)
    }
  } catch (e) {
    // FIXME: Write to log
    if (isAxiosError(e)) {
      debug(`Axios Error:`, e.config)
      debug(`Axios Error:`, e.code, e.name, e.message)
    } else {
      debug('Download Error:', e)
    }

    return failure(e)
  }
}
