import { execSync, spawnSync } from 'node:child_process'
const gitViewDiffDesc = 'git diff '
const gitViewDiff = () => {
  const end = process.argv[3]
  const editor = process.env.EDITOR || 'vi'

  execSync(`git diff ${end} > .view.diff`)
  spawnSync(editor, ['.view.diff'], { stdio: 'inherit' })
}
export {
  gitViewDiffDesc,
  gitViewDiff
}
