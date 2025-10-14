import { spawnSync } from 'node:child_process'

const zellijTabRenameDesc = 'rename zellij tab'
const zellijTabRename = () => {
  spawnSync('zellij', ['action', 'rename-tab', process.argv.slice(2)[1]])
  return
}
export { zellijTabRename, zellijTabRenameDesc }
