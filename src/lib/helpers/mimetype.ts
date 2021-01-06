import type { PlainObject, Maybe } from '../types'
import { extname, basename } from 'path'
import pdfParser from 'pdf-parse'
import { readFile } from '../../app/lib/async-fs'

const knownExtensions: PlainObject<string> = {
  '.code-workspace': 'application/json',
}

export function getMimeTypeFromKnownExtensions(file: string): string {
  const ext = extname(file).toLowerCase()
  return knownExtensions[ext] ?? 'unknown'
}

function getBasename(f: string): string {
  const b = basename(f)
  const m = b.match(/(.+)\.[\w\d]+$/)
  return m ? m[1] : b
}

async function getNameFromVSCodeProj(file: string): Promise<Maybe<string>> {
  try {
    const fc = await readFile(file)
    if (fc.success) {
      const json = JSON.parse(fc.result.toString())

      if (json.folders && Array.isArray(json.folders)) {
        return json.folders[0].name
      }
    }
  } catch (e) {
    console.error('getNameFromVSCodeProj -> Error:', e)
  }

  return undefined
}

async function getPdfTitle(file: string): Promise<string> {
  try {
    const buffer = await readFile(file)

    if (buffer.failure) {
      throw buffer.error
    }

    const pdf = await pdfParser(buffer.result)
    // NOTE: Conscious "falsy" check here
    return pdf.info?.Title || getBasename(file)
  } catch (e) {
    console.error('PDF parse error:', e)
    return getBasename(file)
  }
}

export async function getNameFromKnownFileType(
  file: string
): Promise<Maybe<string>> {
  const ext = extname(file).toLowerCase()

  switch (ext) {
    case '.code-workspace':
      return getNameFromVSCodeProj(file)

    case '.pdf':
      return getPdfTitle(file)

    default:
      return undefined
  }
}
