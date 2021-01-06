import type { AsyncResult } from 'safe-result'
import { join } from 'path'
import type { Project, Maybe } from '../../lib'
import { config } from '../config'
import {
  fileExists,
  mkDir,
  writeFile,
  readDir,
  readFile,
  rmDir,
} from './async-fs'
import { store, saveProjectOrder } from '../store'

const ProjectFileName = '__rf-project.json'

export async function getProjectDirPath(proj: Project): Promise<string> {
  const root = await config.projectsDir()
  return join(root, proj.id)
}

export async function saveProject(proj: Project): Promise<boolean> {
  const pdir = await getProjectDirPath(proj)

  // New project
  if (!(await fileExists(pdir)).result) {
    const r = await mkDir(pdir, true)

    if (!r.success) {
      console.error('Error creating project:', r.error)
      return false
    }

    proj.selected = true
  }

  const f = join(pdir, ProjectFileName)
  const w = await writeFile(f, JSON.stringify(proj))

  if (w.success) {
    return true
  } else {
    console.error(`Failed writing project file:`, w.error)
    return false
  }
}

export async function loadProjects(): Promise<Maybe<Project[]>> {
  const pdir = await config.projectsDir()
  const ps = await readDir(pdir)

  if (ps.success) {
    const pp: Project[] = []

    for (const p of ps.result) {
      const f = join(pdir, p, ProjectFileName)

      if ((await fileExists(f)).success) {
        const fc = await readFile(f)

        if (fc.success) {
          pp.push(JSON.parse(fc.result.toString()) as Project)
        } else {
          console.error(`Failed reading project %O: %O`, f, fc.error)
        }
      }
    }

    const order = store.get('projectOrder')

    if (order) {
      let ppOrdered: Project[] = []

      for (const id of order) {
        const x = pp.findIndex((p) => p.id === id)

        if (x > -1) {
          const y = pp.splice(x, 1)
          ppOrdered = [...ppOrdered, ...y]
        }
      }

      if (pp.length) {
        ppOrdered = [...ppOrdered, ...pp]
      }

      return ppOrdered
    }

    return pp
  } else {
    console.error(`Error reading projects dir:`, pdir)
    return undefined
  }
}

export async function deleteProject(p: Project): AsyncResult<boolean> {
  const pdir = await getProjectDirPath(p)
  const rmres = await rmDir(pdir, { recursive: true })
  console.log(`Result:`, rmres)
  const order = store.get('projectOrder')

  if (rmres.success && order) {
    const idx = order.findIndex((o) => o === p.id)

    if (idx > -1) {
      order.splice(idx, 1)
      saveProjectOrder(order)
    }
  }

  return rmres
}
