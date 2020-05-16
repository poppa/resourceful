import { Project, Maybe } from '../../lib'
import { config } from '../config'
import { join } from 'path'
import { fileExists, mkDir, writeFile, readDir, readFile } from './async-fs'

const ProjectFileName = '__rf-project.json'

async function getProjectDirPath(proj: Project): Promise<string> {
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

    return pp
  } else {
    console.error(`Error reading projects dir:`, pdir)
    return undefined
  }
}
