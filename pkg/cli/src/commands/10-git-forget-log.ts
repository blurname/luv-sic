import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { colorLog } from '@blurname/core/src/colorLog.js'
import { createFzfKit } from '../util/fzf.js'
import { execGitDiff, getGitRootPath, getLogList } from '../util/git.js'
import { getCLIParams } from '../util/params.js'

const gitForgetLogDesc = 'forget console.log from givin commit to head'
const gitForgetLog = () => {
  const { paramList, paramKV } = getCLIParams()
  const isInteractive = paramKV['-I']

  const status = execSync('git status').toString()
  if (!status.includes('working tree clean')) {
    console.log(
      colorLog({
        msg: '因为脚本会改写文件，请保证 git status 结果是空的，防止潜在错误的数据处理对文件内容的意外操作，不要让你的工作成果化为梦幻泡影',
        fg: 'Red',
      })
    )
    return
  }
  console.log(colorLog({ msg: '空无一人这片沙滩', fg: 'Blue' }))

  const runCallback = (selectKey: string) => {
    const commitHash = selectKey.split(' ')[0]
    const diffString = execGitDiff({ type: 'hash', commitHash })
    const diffLines = diffString.split('\n')
    const fileLogObj = {} as Record<string, string[]>
    let currentFileKey = ''
    for (const line of diffLines) {
      if (line.startsWith('+++')) {
        currentFileKey = line.split(' ')[1].replace('b/', '')
        fileLogObj[currentFileKey] = []
      } else {
        if (line.startsWith('+')) {
          if (line.includes('console.')) {
            // TODO: support more language's log
            fileLogObj[currentFileKey].push(line)
          }
        }
      }
    }

    if (Object.keys(fileLogObj).length < 1) {
      console.log(colorLog({ msg: '没有留下任何 log，', fg: 'Green' }))
      return
    }

    const rootPath = getGitRootPath()
    const pathList = [] as string[]
    for (const key in fileLogObj) {
      let value = fileLogObj[key]
      const path = join(rootPath, key)
      if (path.includes('/dev/null')) continue
      const contentArr = readFileSync(path).toString().split('\n')
      const newContentArr = []
      for (const line of contentArr) {
        let hasLog = false
        for (const v of value) {
          if (line.trim().length > 0 && v.includes(line)) {
            // need to filter empty content with using inlcudes
            const firstIndex = value.findIndex((s) => s === v)
            value = value.filter((s, index) => index !== firstIndex)
            hasLog = true
            break
          }
        }
        if (!hasLog) newContentArr.push(line)
      }
      pathList.push(path)
      writeFileSync(path, newContentArr.join('\n'))
    }
    execSync(`git commit -m 'DEL: console.log' -i ${pathList.join(' ')}`)
    console.log(
      colorLog({ msg: '已将 log 清除干净，对应生成了一个 commit', fg: 'Green' })
    )
  }
  if (isInteractive) {
    const fzfKit = createFzfKit({ fzfStringList: getLogList() })
    fzfKit.runFzf({ runCallback })
  } else {
    runCallback(paramList[1])
  }
}
export { gitForgetLog, gitForgetLogDesc }
