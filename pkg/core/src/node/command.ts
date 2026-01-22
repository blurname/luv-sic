import { LG } from "../colorLog"

export const createCommand = ({ desc, fn }: { desc: any; fn: () => any }) => ({ desc, fn })
export const createCommandStore = <const T extends Record<string, { desc: any; fn: () => any }>>({ commandKV }: { commandKV: T }) => {
  const getCommand = (name: keyof T) => commandKV[name]
  return {
    getCommand,
    runCommand: (name: keyof T) => getCommand(name).fn(),
    runCommandUnknown: (name: string) => {
      LG.log(`running_${name}`)
      const res = getCommand(name)
      if (res) {
        res.fn()
      } else {
        LG.error('no such command')
        for (const [k, v] of Object.entries(commandKV)) {
          LG.log(`name_${k}_desc_${v.desc}`)
        }
      }
    }
  }
}
