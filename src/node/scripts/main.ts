import { switchNpmrc } from './0001-switch-npmrc'
import { duCurrentFolder } from './0003-du-current-folder'
import { calcTsPercentInProject } from './0004-calc-ts-percent-in-project'
import { computeWorkingTime } from './0005-calc-working-time'

type WhichCommand = keyof typeof commands

export const commands = {
  switchNpmrc,
  duCurrentFolder,
  calcTsPercentInProject,
  computeWorkingTime,
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
