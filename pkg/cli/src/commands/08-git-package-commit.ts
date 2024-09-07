import { colorLog } from '@blurname/core/src/colorLog.js'
import { execSync } from 'node:child_process'
import { execGitDiff } from '../util/git.js'

const gitCommitDesc = 'quickly git commit which message is the changes of dependencies of package.json'

const customPackageRepoMap: Record<string, string> = {}

const realPackagRepoMap = (packageName: string) => {
  const pkgName = customPackageRepoMap[packageName]
  if (pkgName === undefined) return packageName
  return pkgName
}

const gitCommit = async () => {
  // const prefix = process.argv[3]
  //
  const packageJsonContent = execGitDiff({ type: 'file', fileName: 'package.json' })
  const commitMessage = packageJsonContent
    .split('\n')
    .filter((s) => s.startsWith('+'))
    .filter(s => !s.includes('package.json')) // 过滤文件变化的 message
    .reduce((pre, cur, index) => {
      const parts = cur.split(':')
      const pacakgeName = realPackagRepoMap(parts[0].split('+')[1].trim().split('"')[1])
      const packageVersion = parts[1].split('"')[1]
      const nameVersion = `${pacakgeName}@${packageVersion}`
      if (index === 0) {
        return `${pre} ${nameVersion}`
      }
      return `${pre}&${nameVersion}`
    }, 'UPG:')
    .trimEnd()
  console.log(colorLog({ msg: commitMessage, fg: 'Blue' }))
  const stdout2 = execSync(
   `npm i && git commit -i package.json package-lock.json .ci/.cache-key-file -m '${commitMessage}'`
  )
  console.log(stdout2.toString())
}
export { gitCommit, gitCommitDesc }
