export type Maybe<T> = T | undefined
export type MaybeNull<T> = T | null
export type PlainObject<T = unknown> = { [key: string]: T }
export type ClassType<T> = new () => T
export type Callable = () => unknown
// prettier-ignore
export type TypeOf<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T
