import * as readline from 'node:readline'
import { getPackageJsonFile } from '@blurname/core/src/node/meta-file/npm'
import { execSync } from 'node:child_process'
import { Fzf } from 'fzf'
import { colorLog } from '@blurname/core/src/colorLog'
const main = async () => {
  // const pwd = execSync('pwd').toString().split('\n')[0]
  const rootPackageJsonPath = process.cwd() + '/package.json'
  const jsonFileKit = getPackageJsonFile(rootPackageJsonPath)
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
  let selectIndex = 0
  let selectKey:string
  if (process.stdin.isTTY) { process.stdin.setRawMode(true) }
  process.stdin.on('keypress', (str, key:{name:string, ctrl:boolean}) => {
    if (key.ctrl === true && key.name === 'c') {
      process.exit()
    }
    if (key.name === 'return') {
      // console.log(execSync('ls').toString())
      execSync('bash echo hihi')
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
    console.clear()
    let result = ''
    entries.forEach((entry:{item:string}, index:number) => {
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
    // process.stdout.write("Type characters, 'x' to exit\n")
    console.log(final)
  })
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()

// https://www.educative.io/answers/what-is-readlineemitkeypressevents-in-nodejs
// const readline = require('readline');

// console.log("Press any key")
