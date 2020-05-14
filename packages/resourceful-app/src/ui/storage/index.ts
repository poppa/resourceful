import { PageStateStore } from './pagestate'
import { ProjectsStore } from './projects'
import { StaticStore } from './static'

export const projectsStore = ProjectsStore.create()
export const staticStore = StaticStore.create()
// Need to keep this last
export const pageStateStore = PageStateStore.create()
