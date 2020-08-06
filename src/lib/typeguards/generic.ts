import { Callable, ClassType, PlainObject } from '../types'

export function isPrimitive(t: unknown): t is number | boolean | string {
  const to = typeof t

  return (
    to !== 'undefined' &&
    (to === 'boolean' || to == 'string' || to === 'number')
  )
}

export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export function isNumber(v: unknown): v is number {
  return typeof v === 'number'
}

export function isPlainObject(v: unknown): v is PlainObject {
  return typeof v === 'object' && v !== null && !('constructor' in v)
}

export function isInstance(v: unknown): v is object {
  return typeof v === 'object' && v !== null && 'constructor' in v
}

export function isFloat(v: unknown): v is number {
  return isNumber(v) && `${v}`.includes('.')
}

export function isCallable(v: unknown): v is Callable {
  return typeof v !== 'undefined' && typeof v === 'function'
}

export function isClass(v: unknown): v is ClassType<unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    'constructor' in v &&
    'prototype' in v
  )
}
