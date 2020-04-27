export type Result<T = unknown, E extends Error = Error> =
  | SuccessResult<T>
  | FailureResult<E>

export type AsyncResult<T = unknown, E extends Error = Error> = Promise<
  Result<T, E>
>

interface ResultType {
  readonly value: unknown
  unwrap(): [unknown, unknown]
  yes: unknown
  no: unknown
}

export class SuccessResult<T = unknown> implements ResultType {
  public readonly value: T

  constructor(data: T) {
    this.value = data
  }

  public unwrap(): [undefined, T] {
    return [undefined, this.value]
  }

  public get yes(): T {
    return this.value
  }

  public get no(): false {
    return false
  }
}

export class FailureResult<T extends Error = Error> implements ResultType {
  public readonly value: T

  constructor(error: T) {
    this.value = error
  }

  public unwrap(): [T, undefined] {
    return [this.value, undefined]
  }

  public get yes(): false {
    return false
  }

  public get no(): T {
    return this.value
  }
}

export function success<T>(result: T): SuccessResult<T> {
  return new SuccessResult(result)
}

export function failure<E extends Error>(error: E): FailureResult<E> {
  return new FailureResult(error)
}
