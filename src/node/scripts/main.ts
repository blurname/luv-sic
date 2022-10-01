import { switchNpmrc, switchNpmrcDesc } from './01-switch-npmrc'
import { duCurrentFolder, duCurrentFolderDesc } from './03-du-current-folder'
import { calcTsPercentInProject, calcTsPercentInProjectDesc } from './04-calc-ts-percent-in-project'
import { computeWorkingTime, computeWorkingTimeDesc } from './05-compute-working-time'
import { gitDropVersion, gitDropVersionDesc } from './07-mb-git-drop-version'
import { gitCommit, gitCommitDesc } from './08-mb-git-package-commit'
import { detectCIStatus, detectCIStatusDesc } from './0a-mb-git-detect-ci-status'

type WhichCommand = keyof typeof commands
export const commands = {
  switchNpmrc,
  duCurrentFolder,
  calcTsPercentInProject,
  computeWorkingTime,
  gitDropVersion,
  gitCommit,
  detectCIStatus,
} as const
type Commands = keyof typeof commands

const commandsDesc: { [k in Commands]: string } = {
  switchNpmrc: switchNpmrcDesc,
  duCurrentFolder: duCurrentFolderDesc,
  calcTsPercentInProject: calcTsPercentInProjectDesc,
  computeWorkingTime: computeWorkingTimeDesc,
  gitDropVersion: gitDropVersionDesc,
  gitCommit: gitCommitDesc,
  detectCIStatus: detectCIStatusDesc,
}

const main = () => {
  const [path1, path2, whichCommand] = process.argv
  const realCommand = whichCommand as WhichCommand
  try {
    commands[realCommand]()
  } catch (err) {
    console.log('wrong command')
    console.log('commandList', commandsDesc)
  }
}
main()
