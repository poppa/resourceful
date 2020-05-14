import { Project } from '../../lib'
import { config } from '../config'
import { join } from 'path'
import { fileExists, mkDir, writeFile } from './async-fs'

const ProjectFileName = '__rf-project.json'

async function getProjectDirPath(proj: Project): Promise<string> {
  const root = await config.projectsDir()
  return join(root, proj.id)
}

export async function saveProject(proj: Project): Promise<boolean> {
  const pdir = await getProjectDirPath(proj)
  console.log(`Project:`, pdir)

  if (!(await fileExists(pdir)).result) {
    console.log(`New project, create`)
    const r = await mkDir(pdir, true)

    if (!r.success) {
      console.error('Error creating project:', r.error)
      return false
    }
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
