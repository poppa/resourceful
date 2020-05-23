export enum ResourceType {
  Url,
  File,
  Cmd,
  Text,
}

export interface Resource {
  readonly type: ResourceType
  readonly id: string
  name: string
  contentType?: string
}

export interface WebResource extends Resource {
  href: string
  contentType: string
}

export interface FileResource extends Resource {
  path: string
  contentType: string
}

export interface CmdResource extends Resource {
  cmd: string
  contentType: never
}

export interface TextResource extends Resource {
  text: string
  contentType: string
}
