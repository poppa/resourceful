import { downloadUrl } from '../lib/download'

const protocols = ['http://', 'https://', 'ftp://']

export async function handler(input: string): Promise<boolean> {
  if (protocols.some((p) => input.startsWith(p))) {
    console.log(`Web resource`)
    await downloadUrl(input)
    return true
  } else {
    console.log(`Not a web resource`)
    return false
  }
}
