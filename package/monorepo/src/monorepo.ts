import { execSync } from 'node:child_process'
import { detectSubVersionNeedToUpdate } from './detect-sub-version.js'
import { versionBump } from './version-bump.js'
// const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost']

// 1. the sub package's root directory name must be package // TODO: bl: use arbitrary name
const creteMonoRepo = (subPackageList:string[]) => () => {
  const cleanDist = () => {
    const pkgStr = subPackageList.join(',')
    execSync(`rm -rf dist package/{${pkgStr}}/dist`)
  }

  const cleanNodeModules = () => {
    const pkgStr = subPackageList.join(',')
    execSync(`rm -rf node_modules package/{${pkgStr}}/node_modules`)
  }
  const cleanLock = () => {
    const pkgStr = subPackageList.join(',')
    execSync(`rm -rf pnpm-lock.yaml package/{${pkgStr}}/pnpm-lock.yaml`)
  }

  const func = process.argv[2]
  if (func === 'clean-dist') {
    cleanDist()
  } else if (func === 'clean-node-modules') {
    cleanNodeModules()
  } else if (func === 'version-bump') {
    const needToBumpPkgList = detectSubVersionNeedToUpdate(subPackageList)
    versionBump(needToBumpPkgList)('patch')
  } else if (func === 'clean-lock') {
    cleanLock()
  }
}

// monoRepo()

export {
  creteMonoRepo
}
