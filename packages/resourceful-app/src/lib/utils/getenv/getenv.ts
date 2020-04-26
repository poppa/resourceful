/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
  isUndefined,
  isBoolean,
  isNumber,
  isPlainObject,
  isFloat,
} from '../typeguards'
import {
  EnvType,
  CastType,
  EnvStringType,
  EnvBooleanType,
  EnvIntType,
  EnvFloatType,
  EnvJsonType,
  EnvArrayType,
} from './interfaces'
import {
  isEnvType,
  cast,
  EnvBoolean,
  EnvFloat,
  EnvInt,
  EnvJson,
  EnvArray,
  EnvString,
} from './types'
import { Maybe, PlainObject, TypeOf } from '../../types'

type Primitive = string | number | boolean | unknown[] | PlainObject

// @ts-ignore
export declare function getenv<K extends string>(k: K): Maybe<string>
// @ts-ignore
export declare function getenv<K extends string, V extends Primitive>(
  k: K,
  v: V
): TypeOf<V>
// @ts-ignore
export declare function getenv<K extends string, T extends EnvType>(
  k: K,
  t: T
): Maybe<CastType<T>>
// @ts-ignore
export declare function getenv<
  K extends string,
  V extends Primitive,
  T extends EnvType
>(k: K, v: V, t: T): CastType<T>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getenv<
  K extends string,
  V extends EnvType | Primitive,
  T extends EnvType
>(envKey: K, defaultValue?: V, typehint?: T) {
  const ev = process.env[envKey]

  if (isUndefined(defaultValue)) {
    return ev as string
  }

  if (ev && !isEnvType(defaultValue)) {
    if (isBoolean(defaultValue)) {
      return cast(EnvBoolean, ev)
    } else if (isNumber(defaultValue)) {
      return isFloat(defaultValue) ? cast(EnvFloat, ev) : cast(EnvInt, ev)
    } else if (isPlainObject(defaultValue)) {
      return cast(EnvJson, ev)
    } else if (Array.isArray(defaultValue)) {
      return cast(EnvArray, ev)
    } else {
      return ev
    }
  } else if (ev && isEnvType(defaultValue)) {
    return cast(defaultValue, ev)
  } else if (ev && !isEnvType(defaultValue) && isEnvType(typehint)) {
    console.log(`With default and cast type`)
    return cast(typehint, ev)
  }

  return ev
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface getenv {
  String: EnvStringType
  Boolean: EnvBooleanType
  Int: EnvIntType
  Float: EnvFloatType
  Json: EnvJsonType
  Array: EnvArrayType
}

// @ts-ignore
getenv.String = EnvString
// @ts-ignore
getenv.Boolean = EnvBoolean
// @ts-ignore
getenv.Int = EnvInt
// @ts-ignore
getenv.Float = EnvFloat
// @ts-ignore
getenv.Json = EnvJson
// @ts-ignore
getenv.Array = EnvArray
