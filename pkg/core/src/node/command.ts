import {LG} from "../colorLog"

type Command< Desc = unknown, CommandFn extends () => unknown = () => unknown> = {
  desc: Desc
  fn: CommandFn
}

type CommandKV = Record<string, Command>

type NewCommandKitProps<T> = {
  commandKV: T
}

const createCommandStore = <const T extends CommandKV>({commandKV}: NewCommandKitProps<T>) => {

  const getCommand = <Name extends keyof T>(commandName: Name) => commandKV[commandName]
  
  return {
    getCommand,
    runCommand: <Name extends keyof T>(commandName: Name) => getCommand(commandName).fn(),
    runCommandUnknown: (commandName: string) => {
      LG.log(`running_${commandName}`)
      const res = getCommand(commandName)
      if(res){
        res.fn()
        return
      }
      LG.error('no such command')
      for (const [k,v] of Object.entries(commandKV)) {
        LG.log(`name_${k}_desc_${v.desc}` as string)
      }
      
    } ,
  }
}
const createCommand = <const Desc, fn extends () => unknown>({
  desc,
  fn,
}: Command< Desc, fn>) => {
  return {
    desc,
    fn,
  }
}
export {
  createCommandStore,
  createCommand 
}
