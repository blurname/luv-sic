import { switchNpmrc } from './01-switch-npmrc'
import { duCurrentFolder } from './03-du-current-folder'
import { calcTsPercentInProject } from './04-calc-ts-percent-in-project'
import { computeWorkingTime } from './05-compute-working-time'
import { gitDropVersion } from './07-mb-git-drop-version'
import { gitCommit } from './08-mb-git-package-commit'
import { detectCIStatus } from './0a-mb-git-detect-ci-status'
type WhichCommand = keyof typeof commands

export const commands = {
  switchNpmrc,
  duCurrentFolder,
  calcTsPercentInProject,
  computeWorkingTime,
  gitDropVersion,
  gitCommit,
  detectCIStatus,
}

const main = () => {
  const [path1, path2, whichCommand] = process.argv
  const realCommand = whichCommand as WhichCommand
  try {
    commands[realCommand]()
  } catch (err) {
    console.log('wrong command')
    console.log('commandList', Object.keys(commands))
  }
}
main()
