const EnvString = Symbol('string')
const EnvInt = Symbol('int')
const EnvFloat = Symbol('float')
const EnvBoolean = Symbol('boolean')
const EnvJson = Symbol('json')
const EnvArray = Symbol('array')

export type EnvType =
  | typeof EnvString
  | typeof EnvInt
  | typeof EnvFloat
  | typeof EnvBoolean
  | typeof EnvJson
  | typeof EnvArray

export interface Env {
  (name: string | string[], type: EnvType): Function

  String: typeof EnvString
  Int: typeof EnvInt
  Float: typeof EnvFloat
  Boolean: typeof EnvBoolean
  Json: typeof EnvJson
  Array: typeof EnvArray
}

type AnyObj = { [key: string]: unknown }

/**
 * Method accessor decorator that will return the value of `process.env[name]`
 * if that exists, and will be casted to `type`
 * @param name - Environment variable name to return. If `name` is an array
 *  the first found environment variable will be used
 * @param type - Type to cast the environment variable to
 * @param defaultValue - Default value to set if the `name` argument isn't
 *  found in `process.env`
 */
export function Env(
  name: string | string[],
  type: EnvType = EnvString
): Function {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    if (!Array.isArray(name)) {
      name = [name]
    }

    const resolveEnv = (key: string): boolean => {
      const value: string | undefined = process.env[key]

      if (descriptor.get && value !== undefined) {
        switch (type) {
          case EnvBoolean: {
            descriptor.get = (): boolean =>
              ['true', '1'].includes(value.toLowerCase())
            break
          }

          case EnvInt: {
            descriptor.get = (): number => parseInt(value, 10)
            break
          }

          case EnvFloat: {
            descriptor.get = (): number => parseFloat(value)
            break
          }

          case EnvJson: {
            descriptor.get = (): AnyObj => JSON.parse(value)
            break
          }

          case EnvArray: {
            descriptor.get = (): string[] => {
              let ret: string[] = []

              if (value.includes(',')) {
                ret = value.split(',').map((s) => s.trim())
              } else {
                ret = [value]
              }

              return ret
            }

            break
          }

          default: {
            descriptor.get = (): string => value
          }
        }

        return true
      }

      return false
    }

    for (const n of name) {
      if (resolveEnv(n)) {
        break
      }
    }
  }
}

Env.String = EnvString
Env.Int = EnvInt
Env.Float = EnvFloat
Env.Boolean = EnvBoolean
Env.Json = EnvJson
Env.Array = EnvArray
