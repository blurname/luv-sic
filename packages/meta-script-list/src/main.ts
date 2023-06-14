import { getPackageJsonFile } from '@blurname/core/src/node/meta-file/npm'
import { execSync } from 'node:child_process'
import { Fzf } from 'fzf'
const main = async () => {
  const pwd = execSync('pwd').toString().split('\n')[0]
  // console.log(pwd)
  const rootPackageJsonPath = pwd + '/package.json'
  console.log(rootPackageJsonPath)
  const jsonFileKit = getPackageJsonFile(rootPackageJsonPath)
  const packageJson = JSON.parse(jsonFileKit.getFileContent()) as {scripts:Record<string, string>}
  const scriptKeyList:string[] = []
  const scriptDescList:string[] = []
  console.log(packageJson)
  Object.entries(packageJson.scripts).forEach(([k, v]) => {
    scriptKeyList.push(k)
    scriptDescList.push(v)
  })
  console.log(scriptKeyList)
  console.log(scriptDescList)
  const fzf = new Fzf(scriptKeyList)
  const entries = fzf.find('dev')
  entries.forEach(entry => console.log(entry.item))
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()

// https://www.educative.io/answers/what-is-readlineemitkeypressevents-in-nodejs
// const readline = require('readline');

// console.log("Press any key")

// readline.emitKeypressEvents(process.stdin);
// if (process.stdin.isTTY)
// process.stdin.setRawMode(true);

// process.stdin.on('keypress', (str, key) => {
// if(key.ctrl == true && key.name == 'c'){
// process.exit()
// }
// console.log(str)
// console.log(key)
// })
