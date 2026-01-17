#!/usr/bin/env node
import {
  detectCIStatus,
  detectCIStatusDesc,
} from './commands/0a-git-detect-ci-status'
import { switchNpmrc, switchNpmrcDesc } from './commands/01-switch-npmrc'
import {
  duCurrentFolder,
  duCurrentFolderDesc,
} from './commands/03-du-current-folder'
// import { calcTsPercentInProject, calcTsPercentInProjectDesc } from './commands/04-calc-ts-percent-in-project'
import {
  calcWorkingTime,
  calcWorkingTimeDesc,
} from './commands/05-calc-working-time'
import {
  generateShellCompletions,
  generateShellCompletionsDesc,
} from './commands/06-generate-shell-completions'
import {
  gitDropVersion,
  gitDropVersionDesc,
} from './commands/07-git-drop-version'
import { gitCommit, gitCommitDesc } from './commands/08-git-package-commit'
import {
  gitReplacePackage,
  gitReplacePackageDesc,
} from './commands/09-git-package-replace'
// import { startZellij, startZellijDesc } from './commands/0c-start-zellij'
// import { logRemoteJson, logRemoteJsonDesc } from './commands/0e-log-remote-json'
import { gitForgetLog, gitForgetLogDesc } from './commands/10-git-forget-log'
import {
  metaScriptFzf,
  metaScriptFzfDesc,
} from './commands/11-meta-script-fzf'
import { gitViewDiff, gitViewDiffDesc } from './commands/12-git-view-diff'
import {
  zellijTabRename,
  zellijTabRenameDesc,
} from './commands/13-zellij-tab-rename'
import { npmInstall } from './commands/14-npm-i'
import {
  copyWithVersion,
} from './commands/15-copy-with-version'

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
  gitViewDiff,
  zellijTabRename,
  ni: npmInstall.fn,
  cpv: copyWithVersion,
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
  gitViewDiff: gitViewDiffDesc,
  zellijTabRename: zellijTabRenameDesc,
  ni: npmInstall.desc,
  cpv: '复制/重命名版本文件夹 (支持 sync, rb 子命令)',
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
