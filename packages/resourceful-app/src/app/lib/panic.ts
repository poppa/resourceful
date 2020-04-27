export function panic(
  codeOrMessage: string | number,
  ...rest: unknown[]
): never {
  let exitCode = 1
  if (typeof codeOrMessage === 'number') {
    exitCode = codeOrMessage
  } else {
    rest = [codeOrMessage, ...rest]
  }

  console.error(...rest)
  process.exit(exitCode)
}
