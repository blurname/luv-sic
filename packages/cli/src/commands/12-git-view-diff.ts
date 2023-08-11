import { execSync, spawnSync } from 'node:child_process'
import { getCLIParams } from '../util/params.js'
import { createFzfKit } from '../fzf.js'
const gitViewDiffDesc = 'fuzzy find git diff between Head to givin hash, then use terminal editor to view it by env.EDITOR'
const gitViewDiff = () => {
  const editor = process.env.EDITOR || 'vi'

  const { paramList, paramKV } = getCLIParams()
  const isInteractive = paramKV['-I']
  const notDeleteFile = Boolean(paramKV['-ND'])

  const runCallback = (selectKey:string) => {
    const commitHash = selectKey.split(' ')[0]
    const diffFile = `__${commitHash}__view.diff`
    execSync(`git diff ${commitHash} > ${diffFile}`)
    spawnSync(editor, [`${diffFile}`], { stdio: 'inherit' }) // 不能用 spawn，会让 stdin.on() 持续监听 keypress 事件，打开编辑文件有问题
    !notDeleteFile && execSync(`rm ${diffFile}`) // 燕过无痕，删了它
  }

  if (isInteractive) {
    const recentCommitsList = execSync('git log --oneline -30').toString().split('\n')
    const fzfKit = createFzfKit({ fzfStringList: recentCommitsList })
    fzfKit.runFzf({ runCallback })
  } else {
    runCallback(paramList[1])
  }
}
export {
  gitViewDiffDesc,
  gitViewDiff
}
