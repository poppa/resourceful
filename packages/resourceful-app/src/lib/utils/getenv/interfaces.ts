import { PlainObject } from '../..'
import {
  EnvString,
  EnvBoolean,
  EnvInt,
  EnvFloat,
  EnvJson,
  EnvArray,
} from './types'

export interface Castable<T = string> {
  cast(v?: string): T
}

export type EnvStringType = typeof EnvString
export type EnvBooleanType = typeof EnvBoolean
export type EnvIntType = typeof EnvInt
export type EnvFloatType = typeof EnvFloat
export type EnvJsonType = typeof EnvJson
export type EnvArrayType = typeof EnvArray

export type EnvType =
  | EnvStringType
  | EnvBooleanType
  | EnvIntType
  | EnvFloatType
  | EnvJsonType
  | EnvArrayType

// prettier-ignore
export type CastType<T extends EnvType> =
  T extends EnvBooleanType ? boolean     :
  T extends EnvFloatType   ? number      :
  T extends EnvIntType     ? number      :
  T extends EnvJsonType    ? PlainObject :
  T extends EnvArrayType   ? string[]    :
  string
