import { AsyncResult, success, failure } from 'safe-result'
import axios from 'axios'
import { PlainObject } from '../../lib'

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

async function parseSnippet(_html: string): Promise<void> {
  //
}

export async function downloadUrl(url: string): AsyncResult<string> {
  try {
    console.log(`Begin dowload:`, url)
    const x = await axios.get(url)

    if (x.status / 100 === 2) {
      const ct = getContentType(x.headers || {})
      const cs = getCharset(x.headers)

      console.log(`Downloaded:`, x.status, ct, cs)

      if (ct === 'text/html') {
        parseSnippet(x.data)
      }

      return success('yay')
    } else {
      throw new Error(`Non-200 response ${x.status} ${x.statusText}`)
    }
  } catch (e) {
    console.error('Download Error:', e)
    return failure(e)
  }
}
