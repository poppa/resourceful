import debug from 'debug'

export function logDebug(ns: string): debug.Debugger {
  return debug(ns)
}
