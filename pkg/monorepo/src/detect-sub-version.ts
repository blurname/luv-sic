import { execSync } from 'node:child_process'

const detectSubVersionNeedToUpdate = (subPkgList: string[]) => {
  const recentVersionCommitHashIn30 = execSync(
    'git log --oneline -30 | grep VERSION -m 1'
  )
    .toString()
    .split(' ')[0]
  const needToBumpPkgList = subPkgList.filter((pkgName) => {
    return (
      execSync(
        `git diff ${recentVersionCommitHashIn30} ${pkgName}`
      ).toString() !== ''
    )
  })

  return needToBumpPkgList
}
export { detectSubVersionNeedToUpdate }
