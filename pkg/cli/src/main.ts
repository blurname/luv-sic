#!/usr/bin/env node
import {
  detectCIStatus,
  detectCIStatusDesc
} from './commands/0a-git-detect-ci-status.js'
import { switchNpmrc, switchNpmrcDesc } from './commands/01-switch-npmrc.js'
import {
  duCurrentFolder,
  duCurrentFolderDesc
} from './commands/03-du-current-folder.js'
// import { calcTsPercentInProject, calcTsPercentInProjectDesc } from './commands/04-calc-ts-percent-in-project.js'
import {
  calcWorkingTime,
  calcWorkingTimeDesc
} from './commands/05-calc-working-time.js'
import {
  generateShellCompletions,
  generateShellCompletionsDesc
} from './commands/06-generate-shell-completions.js'
import {
  gitDropVersion,
  gitDropVersionDesc
} from './commands/07-git-drop-version.js'
import { gitCommit, gitCommitDesc } from './commands/08-git-package-commit.js'
import {
  gitReplacePackage,
  gitReplacePackageDesc
} from './commands/09-git-package-replace.js'
// import { startZellij, startZellijDesc } from './commands/0c-start-zellij.js'
// import { logRemoteJson, logRemoteJsonDesc } from './commands/0e-log-remote-json.js'
import { gitForgetLog, gitForgetLogDesc } from './commands/10-git-forget-log.js'
import {
  metaScriptFzf,
  metaScriptFzfDesc
} from './commands/11-meta-script-fzf.js'
import { gitViewDiff, gitViewDiffDesc } from './commands/12-git-view-diff.js'

export const commands = {
  switchNpmrc,
  duCurrentFolder,
  // calcTsPercentInProject,
  calcWorkingTime,
  gitDropVersion,
  gitCommit,
  detectCIStatus,
  gitReplacePackage,
  // startZellij,
  generateShellCompletions,
  // logRemoteJson,
  gitForgetLog,
  metaScriptFzf,
  gitViewDiff
} as const
type Commands = keyof typeof commands

const commandsDesc: Record<Commands, string> = {
  // calcTsPercentInProject: calcTsPercentInProjectDesc,
  calcWorkingTime: calcWorkingTimeDesc,
  duCurrentFolder: duCurrentFolderDesc,
  detectCIStatus: detectCIStatusDesc,
  gitCommit: gitCommitDesc,
  gitDropVersion: gitDropVersionDesc,
  gitReplacePackage: gitReplacePackageDesc,
  gitForgetLog: gitForgetLogDesc,
  // startZellij: startZellijDesc,
  switchNpmrc: switchNpmrcDesc,
  generateShellCompletions: generateShellCompletionsDesc,
  // logRemoteJson: logRemoteJsonDesc,
  metaScriptFzf: metaScriptFzfDesc,
  gitViewDiff: gitViewDiffDesc
}

const main = async () => {
  const whichCommand = process.argv[2] as Commands
  try {
    await commands[whichCommand]()
  } catch (err) {
    console.log(err)
    console.log('wrong command')
    console.log('commandList', commandsDesc)
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
