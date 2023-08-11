import { execSync, spawnSync } from 'node:child_process'
import { getCLIParams } from '../util/params.js'
import { createFzfKit } from '../fzf.js'
const gitViewDiffDesc = 'fuzzy find git diff between Head to givin hash, then use terminal editor to view it'
const gitViewDiff = () => {
  const editor = process.env.EDITOR || 'vi'

  const { paramList, paramKV } = getCLIParams()
  const isInteractive = (paramKV as any)['-I']

  if (isInteractive) {
    const recentCommitsList = execSync('git log --oneline -30').toString().split('\n')

    const fzfKit = createFzfKit({ fzfStringList: recentCommitsList })
    const runCallback = (selectKey:string) => {
      const commitHash = selectKey.split(' ')[0]
      const diffFile = `__${commitHash}__view.diff`
      execSync(`git diff ${commitHash} > ${diffFile}`)
      // 不能用 spawn，会让 stdin.on() 持续监听 keypress 事件，打开编辑文件有问题
      spawnSync(editor, [`${diffFile}`], { stdio: 'inherit' })
      // 删了
      execSync(`rm ${diffFile}`)
    }
    fzfKit.runFzf({ runCallback })
  } else {
    const commitHash = paramList[0]
    const diffFile = `__${commitHash}__view.diff`
    execSync(`git diff ${commitHash} > ${diffFile}`)
    spawnSync(editor, [diffFile], { stdio: 'inherit' })
    execSync(`rm ${diffFile}`)
  }
}
export {
  gitViewDiffDesc,
  gitViewDiff
}
