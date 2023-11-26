import { execSync } from 'node:child_process'
import { detectSubVersionNeedToUpdate } from './detect-sub-version.js'
import { versionBump } from './version-bump.js'
// const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost']

// 1. the sub package's root directory name must be package // TODO: bl: use arbitrary name
type ExtraFunc = {
  [k:string]:(subPkgList:string[])=> void
}
type CreteMonoRepoProps = {
 subPkgList: string[]
 extraFunc?: ExtraFunc
}
const creteMonorepo = ({ subPkgList, extraFunc }:CreteMonoRepoProps) => () => {
  const cleanDist = () => {
    const pkgStr = subPkgList.join(',')
    execSync(`rm -rf dist pkg/{${pkgStr}}/dist`)
  }

  const cleanNodeModules = () => {
    const pkgStr = subPkgList.join(',')
    execSync(`rm -rf node_modules pkg/{${pkgStr}}/node_modules`)
  }
  const cleanLock = () => {
    const pkgStr = subPkgList.join(',')
    execSync(`rm -rf pnpm-lock.yaml pkg/{${pkgStr}}/pnpm-lock.yaml`)
  }

  const func = process.argv[2]

  if (func === 'clean-dist') {
    cleanDist()
  } else if (func === 'clean-node-modules') {
    cleanNodeModules()
  } else if (func === 'version-bump') {
    const needToBumpPkgList = detectSubVersionNeedToUpdate(subPkgList)
    versionBump(needToBumpPkgList)('patch')
  } else if (func === 'clean-lock') {
    cleanLock()
  } else {
    if (extraFunc && typeof extraFunc[func] === 'function') {
      extraFunc[func](subPkgList)
    }
  }
}

export {
  creteMonorepo
}
