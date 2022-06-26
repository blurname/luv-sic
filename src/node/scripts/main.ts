import {switchNpmrc} from  './0001-switch-npmrc'

type WhichCommand = keyof typeof commands

const commands = {
  switchNpmrc
} 

const main = () => {
  const [path1,path2,whichCommand] = process.argv
  console.log(process.argv)
  const realCommand = whichCommand as WhichCommand
  console.log(realCommand)
  if(realCommand === 'switchNpmrc'){
    commands.switchNpmrc()
  }
}
main()