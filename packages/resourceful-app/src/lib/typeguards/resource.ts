import {
  WebResource,
  Resource,
  FileResource,
  CmdResource,
  TextResource,
} from '../interfaces/resource'

export function isResource(o: unknown): o is Resource {
  return (
    typeof o === 'object' &&
    o !== null &&
    'type' in o &&
    typeof (o as Resource).type === 'number' &&
    'name' in o &&
    typeof (o as Resource).name === 'string'
  )
}

export function isWebResource(o: unknown): o is WebResource {
  return isResource(o) && 'href' in o
}

export function isFileResource(o: unknown): o is FileResource {
  return isResource(o) && 'path' in o
}

export function isCmdResource(o: unknown): o is CmdResource {
  return isResource(o) && 'cmd' in o
}

export function isTextResource(o: unknown): o is TextResource {
  return isResource(o) && 'text' in o
}
