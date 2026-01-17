import * as readline from 'node:readline'
import { colorLog } from '@blurname/core/src/colorLog'
import { Fzf } from 'fzf'

type Props = {
  fzfStringList: string[]
  config?: {
    msg?: (item: string) => string
  }
}

type RunFzfProps = {
  runCallback: (selectKey: string) => void
}
const createFzfKit = ({ fzfStringList, config }: Props) => {
  const fzf = new Fzf(fzfStringList)
  const inputList: string[] = []
  let selectIndex = 0
  let selectKey = fzfStringList[0]
  let resultList: string[] = []

  const logFzfResult = ({
    findedItemList,
    inputStr,
    selectIndex,
  }: {
    findedItemList: { item: string }[]
    inputStr: string
    selectIndex: number
  }) => {
    let result = ''
    findedItemList.forEach((entry, index: number) => {
      resultList.push(entry.item)

      // msg
      let msg = `${entry.item}\n`
      if (config?.msg) {
        msg = config.msg(entry.item)
      }

      if (index === selectIndex) {
        selectKey = entry.item
        result += colorLog({ msg, fg: 'Green' })
      } else {
        result += msg
      }
    })
    const final = inputStr + '\n_______________\n' + result
    process.stdout.clearLine(1) // this reduce the flicking, but why?
    process.stdout.cursorTo(0) // keep cursor pos for experience
    console.clear()
    process.stdout.write(final)
  }

  const runFzf = ({ runCallback }: RunFzfProps) => {
    readline.emitKeypressEvents(process.stdin)

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true)
    }

    const firstFindedItemList = fzf.find('')
    logFzfResult({
      findedItemList: firstFindedItemList,
      inputStr: '',
      selectIndex: 0,
    })
    const keyPressCallback = (
      str: string,
      key: { name: string; ctrl: boolean }
    ) => {
      // =====================
      // exit: esc/ ctrl+c
      // up: arrow up
      // down: arrow down
      // delete input char: backspace
      // =====================
      if ((key.ctrl === true && key.name === 'c') || key.name === 'escape') {
        process.exit()
      }
      if (key.name === 'return') {
        runCallback(selectKey)
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
      const findedItemList = fzf.find(inputStr)
      resultList = []
      logFzfResult({ findedItemList, inputStr, selectIndex })
    }
    process.stdin.on('keypress', keyPressCallback)
  }
  return {
    logFzfResult,
    runFzf,
  }
}
export { createFzfKit }
