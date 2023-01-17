import { switchNpmrc, switchNpmrcDesc } from './01-switch-npmrc'
import { duCurrentFolder, duCurrentFolderDesc } from './03-du-current-folder'
import { calcTsPercentInProject, calcTsPercentInProjectDesc } from './04-calc-ts-percent-in-project'
import { calcWorkingTime, calcWorkingTimeDesc } from './05-calc-working-time'
import { generateShellCompletions, generateShellCompletionsDesc } from './06-generate-shell-completions'
import { gitDropVersion, gitDropVersionDesc } from './07-git-drop-version'
import { gitCommit, gitCommitDesc } from './08-git-package-commit'
import { gitReplacePackage, gitReplacePackageDesc } from './09-git-package-replace'
import { detectCIStatus, detectCIStatusDesc } from './0a-git-detect-ci-status'
import { startZellij, startZellijDesc } from './0c-start-zellij'

export const commands = {
  switchNpmrc,
  duCurrentFolder,
  calcTsPercentInProject,
  calcWorkingTime,
  gitDropVersion,
  gitCommit,
  detectCIStatus,
  gitReplacePackage,
  startZellij,
  //generateShellCompletions,
} as const
type Commands = keyof typeof commands

const commandsDesc: { [k in Commands]: string } = {
  calcTsPercentInProject: calcTsPercentInProjectDesc,
  calcWorkingTime: calcWorkingTimeDesc,
  duCurrentFolder: duCurrentFolderDesc,
  detectCIStatus: detectCIStatusDesc,
  gitCommit: gitCommitDesc,
  gitDropVersion: gitDropVersionDesc,
  gitReplacePackage: gitReplacePackageDesc,
  startZellij: startZellijDesc,
  switchNpmrc: switchNpmrcDesc,
  //generateShellCompletions: generateShellCompletionsDesc,
}

const main = async () => {
  const whichCommand = process.argv[2] as Commands
  try {
    await commands[whichCommand]()
  } catch (err) {
    console.log('wrong command')
    console.log('commandList', commandsDesc)
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
