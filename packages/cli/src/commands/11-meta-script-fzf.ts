import * as readline from 'node:readline'
import { getPackageJsonFile } from '@blurname/core/src/node/meta-file/npm'
import { spawnSync } from 'node:child_process'
import { Fzf } from 'fzf'
import { colorLog } from '@blurname/core/src/colorLog'
const metaScriptFzfDesc = 'use fzf to search & execute script in project meta file '
const metaScriptFzf = async () => {
  const logFzfResult = ({ entries, inputStr, selectIndex }:{entries:{item:string}[], inputStr:string, selectIndex:number}) => {
    let result = ''
    entries.forEach((entry, index:number) => {
      resultList.push(entry.item)
      if (index === selectIndex) {
        selectKey = entry.item
        result += colorLog({ msg: `${entry.item}: ${keyDescMap.get(entry.item)}\n`, fg: 'Green' })
      } else {
        result += `${entry.item}: ${keyDescMap.get(entry.item)}\n`
      }
    }
    )
    const final = inputStr + '\n_______________\n' + result
    console.clear()
    console.log(final)
  }

  const jsonFileKit = getPackageJsonFile()
  const packageJson = JSON.parse(jsonFileKit.getFileContent()) as {scripts:Record<string, string>}

  const scriptKeyList:string[] = []
  const scriptDescList:string[] = []
  const keyDescMap = new Map(Object.entries(packageJson.scripts))

  Object.entries(packageJson.scripts).forEach(([k, v]) => {
    scriptKeyList.push(k)
    scriptDescList.push(v)
  })

  const fzf = new Fzf(scriptKeyList)
  readline.emitKeypressEvents(process.stdin)
  const inputList:string[] = []
  let resultList: string[] = []

  if (process.stdin.isTTY) { process.stdin.setRawMode(true) }

  const entries = fzf.find('')
  let selectIndex = 0
  let selectKey = scriptKeyList[0]
  logFzfResult({ entries, inputStr: '', selectIndex: 0 })

  process.stdin.on('keypress', (str, key:{name:string, ctrl:boolean}) => {
    console.log(key.name)
    if ((key.ctrl === true && key.name === 'c') ||
      key.name === 'escape') {
      process.exit()
    }
    if (key.name === 'return') {
      spawnSync('npm', ['run', selectKey], { stdio: 'inherit' })
      process.exit()
    }

    if (key.name === 'backspace') {
      inputList.pop()
      selectIndex = 0
    } else if (key.name === 'up') {
      if (selectIndex - 1 < 0) {
        selectIndex = resultList.length - 1
      } else {
        selectIndex = (selectIndex - 1) % resultList.length
      }
    } else if (key.name === 'down') {
      selectIndex = (selectIndex + 1) % resultList.length
    } else {
      inputList.push(str)
      selectIndex = 0
    }
    const inputStr = inputList.join('')
    const entries = fzf.find(inputStr)
    resultList = []
    logFzfResult({ entries, inputStr, selectIndex })
  })
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
export {
  metaScriptFzf, metaScriptFzfDesc
}

// https://www.educative.io/answers/what-is-readlineemitkeypressevents-in-nodejs
// const readline = require('readline');

// console.log("Press any key")
