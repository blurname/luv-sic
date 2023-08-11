import { getPackageJsonFile } from '@blurname/core/src/node/meta-file/npm'
import { createFzfKit } from '../fzf.js'
const metaScriptFzfDesc = 'use fzf to search & execute script in project meta file '
const metaScriptFzf = async () => {
  const jsonFileKit = getPackageJsonFile()
  const packageJson = JSON.parse(jsonFileKit.getFileContent()) as {scripts:Record<string, string>}

  const scriptKeyList:string[] = []

  const keyDescMap = new Map(Object.entries(packageJson.scripts))

  Object.entries(packageJson.scripts).forEach(([k, v]) => {
    scriptKeyList.push(k)
  })

  const config = {
    msg: (item:string) => {
      return `${item}: ${keyDescMap.get(item)}\n`
    }
  }

  const fzfKit = createFzfKit({ fzfStringList: scriptKeyList, config })
  fzfKit.runFzf()
}
export {
  metaScriptFzf, metaScriptFzfDesc
}

// https://www.educative.io/answers/what-is-readlineemitkeypressevents-in-nodejs
// const readline = require('readline');

// console.log("Press any key")
