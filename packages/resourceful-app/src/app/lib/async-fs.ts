import { PathLike, promises, Stats } from 'fs'
import { W_OK } from 'constants'
import { AsyncResult, success, failure } from '../../lib'

export async function fileExists(p: PathLike): AsyncResult<boolean> {
  try {
    await promises.access(p, W_OK)
    return success(true)
  } catch (e) {
    return failure(e)
  }
}

export async function fileStat(p: PathLike): AsyncResult<Stats> {
  try {
    const st = await promises.lstat(p)
    return success(st)
  } catch (e) {
    return failure(e)
  }
}

export async function isDir(p: PathLike): AsyncResult<boolean> {
  const r = await fileStat(p)
  return r.yes ? success(r.value.isDirectory()) : r
}

export async function isFile(p: PathLike): AsyncResult<boolean> {
  const r = await fileStat(p)
  return r.yes ? success(r.value.isFile()) : r
}

export async function mkDir(
  p: PathLike,
  recursive = false
): AsyncResult<boolean> {
  try {
    await promises.mkdir(p, { recursive })
    return success(true)
  } catch (e) {
    return failure(e)
  }
}

export async function readDir(p: PathLike): AsyncResult<string[]> {
  try {
    const r = await promises.readdir(p)
    return success(r)
  } catch (e) {
    return failure(e)
  }
}
