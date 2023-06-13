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
