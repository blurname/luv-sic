import { execSync, spawnSync } from 'node:child_process'
import { createFzfKit } from '../util/fzf'
import { getLogList } from '../util/git'
import { getCLIParams } from '../util/params'

const gitViewDiffDesc =
  'fuzzy find git diff between Head to givin hash, then use terminal editor to view it by env.EDITOR'
const gitViewDiff = () => {
  const editor = process.env.EDITOR || 'vi'

  const { paramList, paramKV } = getCLIParams()
  const isInteractive = paramKV['-I']
  const keepFile = Boolean(paramKV['--keep'])
  const useNvim = Boolean(paramKV['--nvim']) // ref: https://writings.sh/post/code-review-by-nvim-diffview

  const runCallback = (selectKey: string) => {
    const commitHash = selectKey.split(' ')[0]
    const diffFile = `__${commitHash}__view.diff`
    if (useNvim) {
      spawnSync(editor, ['-c', `DiffviewOpen ${commitHash}`], {
        stdio: 'inherit',
      }) // nvim 需要安装 diffview.nvim 插件
    } else {
      execSync(`git diff ${commitHash} > ${diffFile}`)
      spawnSync(editor, [`${diffFile}`], { stdio: 'inherit' }) // 不能用 spawn，会让 stdin.on() 持续监听 keypress 事件，打开编辑文件有问题
      !keepFile && execSync(`rm ${diffFile}`) // 燕过无痕，删了它
    }
  }

  if (isInteractive) {
    const fzfKit = createFzfKit({ fzfStringList: getLogList() })
    fzfKit.runFzf({ runCallback })
  } else {
    runCallback(paramList[1])
  }
}
export { gitViewDiffDesc, gitViewDiff }
