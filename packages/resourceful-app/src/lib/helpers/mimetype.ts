import { PlainObject, Maybe } from '../types'
import { extname } from 'path'
import { readFile } from '../../app/lib/async-fs'

const knownExtensions: PlainObject<string> = {
  '.code-workspace': 'application/json',
}

export function getMimeTypeFromKnownExtensions(file: string): string {
  const ext = extname(file).toLowerCase()
  return knownExtensions[ext] ?? 'unknown'
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

export async function getNameFromKnownFileType(
  file: string
): Promise<Maybe<string>> {
  const ext = extname(file).toLowerCase()

  switch (ext) {
    case '.code-workspace':
      return getNameFromVSCodeProj(file)

    default:
      return undefined
  }
}
