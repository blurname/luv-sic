import { execSync, spawn, spawnSync } from 'node:child_process'
const gitViewDiffDesc = 'git diff '
const gitViewDiff = () => {
  const end = process.argv[3]
  const editor = process.env.EDITOR || 'vi'

  execSync(`git diff ${end} > .view.diff`)
  const viewProcess = spawn(editor, ['.view.diff'], { stdio: 'inherit' })
  viewProcess.on('exit', () => {
    execSync('rm .view.diff')
  })

  // const version = execSync('git log --oneline | grep VERSION -m 1').toString().split('\n')[0].split('@').at(-1)
  // const fzf = new Fzf(scriptKeyList)
}
export {
  gitViewDiffDesc,
  gitViewDiff
}
