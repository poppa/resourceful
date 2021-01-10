import type { Point } from './point'
import type { PlainObject } from '../types'

export enum ResourceType {
  Any,
  Url,
  File,
  Cmd,
  Text,
  Snippet,
}

export interface ResourceAssets {
  icon?: string
  image?: string
}

export interface ResourceState extends PlainObject {
  collapsed?: boolean
  hasCard?: boolean
  favorite?: boolean
}

export interface Resource {
  readonly type: ResourceType
  readonly id: string
  name: string
  contentType?: string
  assets?: ResourceAssets
  position?: Point
  state?: ResourceState
}

export interface WebResource extends Resource {
  type: ResourceType.Url
  href: string
  contentType: string
}

export interface FileResource extends Resource {
  type: ResourceType.File
  path: string
  contentType: string
}

export interface CmdResource extends Resource {
  type: ResourceType.Cmd
  cmd: string
  contentType: never
}

export interface TextResource extends Resource {
  type: ResourceType.Text
  text: string
  contentType: string
}

export interface SnippetResource extends TextResource {
  language?: string
}

export type ResourceOf<T extends { type: ResourceType }> = T extends {
  type: ResourceType.Url
}
  ? WebResource
  : T extends { type: ResourceType.File }
  ? FileResource
  : T extends { type: ResourceType.Cmd }
  ? CmdResource
  : T extends { type: ResourceType.Text }
  ? TextResource
  : never

export type ResourceAny =
  | WebResource
  | FileResource
  | CmdResource
  | TextResource
