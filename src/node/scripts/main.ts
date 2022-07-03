import {switchNpmrc} from  './0001-switch-npmrc'
import {duCurrentFolder} from './0003-du-current-folder'

type WhichCommand = keyof typeof commands

const commands = {
  switchNpmrc,
  duCurrentFolder
} 

const main = () => {
  const [path1,path2,whichCommand] = process.argv
  const realCommand = whichCommand as WhichCommand
  try {
    commands[realCommand]()
  } catch (err) {
    console.log('wrong command')
    console.log('commandList',Object.keys(commands))
  }
}
main()
