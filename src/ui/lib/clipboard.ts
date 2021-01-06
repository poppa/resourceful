import type electron from 'electron'
import { projectsStore } from '../storage'

function isPaste(e: KeyboardEvent): boolean {
  return e.metaKey && e.code === 'KeyV'
}

const { clipboard } = window.require('electron') as typeof electron

window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('keydown', (e) => {
    if (isPaste(e)) {
      projectsStore.resolveResource(clipboard.readText())
    }
  })
})
