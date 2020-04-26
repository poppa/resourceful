import { EnvType, CastType, Castable } from './interfaces'
import { Maybe } from '../../types'

export function isEnvType(o: unknown): o is EnvType {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return (
    typeof o === 'function' &&
    o !== null &&
    'constructor' in o &&
    'typeName' in o
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function cast<F extends EnvType, V extends string>(
  f: F,
  v: V
): CastType<F> {
  return new f().cast(v) as CastType<F>
}

export abstract class Type {
  static readonly typeName: string

  static isString(t: unknown): t is EnvString {
    return isEnvType(t) && t.typeName === 'string'
  }

  static isBoolean(t: unknown): t is EnvBoolean {
    return isEnvType(t) && t.typeName === 'boolean'
  }

  static isInt(t: unknown): t is EnvInt {
    return isEnvType(t) && t.typeName === 'int'
  }

  static isFloat(t: unknown): t is EnvFloat {
    return isEnvType(t) && t.typeName === 'float'
  }

  static isJson(t: unknown): t is EnvJson {
    return isEnvType(t) && t.typeName === 'json'
  }

  static isArray(t: unknown): t is EnvArray {
    return isEnvType(t) && t.typeName === 'array'
  }

  public abstract cast(_v?: string): unknown
}

export class EnvString extends Type implements Castable<Maybe<string>> {
  static readonly typeName = 'string'

  public cast(v?: string): Maybe<string> {
    return v
  }
}

export class EnvBoolean extends Type implements Castable<Maybe<boolean>> {
  static readonly typeName = 'boolean'

  public cast(v?: string): Maybe<boolean> {
    return v ? new Boolean(v).valueOf() : undefined
  }
}

export class EnvInt extends Type implements Castable<Maybe<number>> {
  static readonly typeName = 'int'

  public cast(v?: string): Maybe<number> {
    return v ? parseInt(v, 10) : undefined
  }
}

export class EnvFloat extends Type implements Castable<Maybe<number>> {
  static readonly typeName = 'float'

  public cast(v?: string): Maybe<number> {
    return v ? parseFloat(v) : undefined
  }
}

export class EnvJson<T = unknown> extends Type implements Castable<Maybe<T>> {
  static readonly typeName = 'json'

  public cast(v?: string): Maybe<T> {
    try {
      const x = v ? (JSON.parse(v) as T) : undefined
      return x
    } catch {
      return undefined
    }
  }
}

export class EnvArray extends Type implements Castable<Maybe<string[]>> {
  static readonly typeName = 'array'

  public cast(v?: string): Maybe<string[]> {
    return v ? v.split(',').map((s) => s.trim()) : undefined
  }
}
