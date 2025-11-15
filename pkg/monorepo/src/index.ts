import { execSync } from 'node:child_process'
import { detectSubVersionNeedToUpdate } from './detect-sub-version.js'
import { createTagPush, createTagPushExtEff, pkgPublish } from './tag-push.js'
import { versionBump } from './version-bump.js'
import { createPJFilekit, findDownPkg } from '@blurname/core/src/node/fileKit.js'
import {getCallPath} from '@blurname/core/src/node/cli.js'
import {versionBumpExt} from './version-bump-ext.js'

// const SUB_PACKAGE_LIST = ['core', 'cli', 'svgminify', 'lost']

// 1. the sub package's root directory name must be package // TODO: bl: use arbitrary name
type ExtraFunc = {
  [k: string]: (subPkgList: string[]) => void
}
type CreteMonoRepoProps = {
  extraFunc?: ExtraFunc
}
const creteMonorepo =
  ({ extraFunc }: CreteMonoRepoProps) =>
  () => {
    const pjfk = createPJFilekit({path: getCallPath()})
    const subPkgPathList = findDownPkg(pjfk)

    const _mapSubPkgPathList = (pkgFunc: (subPath: string)=>void) => {
      for (const subPkgPath of subPkgPathList) {
        pkgFunc(subPkgPath)
      }
    }

    const func = process.argv[2]

    switch (func) {
      case 'clean-dist': {
        _mapSubPkgPathList((ap)=>execSync(`rm -rf dist ${ap}/dist`))
        break
      }
      case 'version-bump': {
        versionBump(pjfk, subPkgPathList)('patch')
        break
      }
      case 'version-bump-minor': {
        versionBump(pjfk, subPkgPathList)('minor')
        break
      }
      case 'version-bump-major': {
        versionBump(pjfk, subPkgPathList)('major')
        break
      }
      case 'version-bump-ext': {
        versionBumpExt()
        // versionBump(pjfk, subPkgPathList)('major')
        break
      }
      case 'tag-push': {
        createTagPush(pjfk)
        break
      }
      case 'tag-push-ext': {
        createTagPushExtEff(pjfk)
        break
      }
      case 'pkg-publish': {
        _mapSubPkgPathList(pkgPublish)
        break
      }
      case 'clean-lock': {
        _mapSubPkgPathList((ap)=>execSync(`rm -rf ${ap}/package-lock.json`))
        break
      }
      case 'clean-nm': {// nm: node_modules
        _mapSubPkgPathList((ap)=>execSync(`rm -rf ${ap}/node_modules`))
      }
      default: {
        if (extraFunc && typeof extraFunc[func] === 'function') {
          extraFunc[func](subPkgPathList)
        }
      }
    }
  }

export { creteMonorepo }
