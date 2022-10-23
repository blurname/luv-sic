import { commands } from './main'
import { writeFile } from '../core'
// https://rsteube.github.io/carapace-bin/spec/examples.html
const generateShellCompletionsDesc = `using carapace to custom my commands completions`
const generateShellCompletions = async () => {
  const keys = Object.keys(commands)
  let caraPaceSpec = `name: bl\ncommands:\n`
  keys.forEach((k) => {
    caraPaceSpec += `  - name: ${k}\n`
  })
  console.log(caraPaceSpec)
  await writeFile('/home/bl/df/config/.config/carapace/specs/bl.yaml', caraPaceSpec)
}
export { generateShellCompletions, generateShellCompletionsDesc }
generateShellCompletions()
