import {basename} from "node:path"
import {LG} from "@blurname/core/src/colorLog.js"
import {createCliStoreEff, getCallPath} from "@blurname/core/src/node/cli.js"
import {createJfk, createPJFilekit} from "@blurname/core/src/node/fileKit.js"
import {getCurBranch, isMasterBranch} from "@blurname/core/src/node/git.js"
import {extractVersionStrNumber, versionBumpBranch} from "./version-bump.js"
import {execSync} from "node:child_process"

// bump the version in ext file
// for smooth developing in current collaborative working
// ====
// assume the version ext file is ${branch}.json , and there must has MasterBranch as the sign
// {
//   version: '1.0.0'
// }
const versionBumpExt = () => {
  const pjfk = createPJFilekit({path: getCallPath()})
  const versionExtPathList = pjfk.getV<string[] | undefined>('VERISON_EXT_PATH')
  if(!versionExtPathList) {
    LG.error('no VERISON_EXT_PATH, add it in package.json')
    return
  }

  const cliStore = createCliStoreEff({
    arg: {
      'branch': {type:'string', desc: 'specific branch'},
      'digit': {desc: 'bump digit', type:'list',value: ['patch','minor','major']}
    }
  })
  const value = cliStore.getArg('digit')

  const curBranch = cliStore.getArgDefault('branch', getCurBranch())
  const curExt = versionExtPathList.find(i => basename(i,'.json') === curBranch)
  if(!curExt){
    LG.error('curBranch no ext json')
    return
  }

  const masterExt = versionExtPathList.find(i => isMasterBranch(basename(i,'.json')))
  if(!masterExt){
    LG.error('masterBranch no ext json')
    return
  }

  const masterExtJfk = createJfk({path: masterExt})
  const curExtJfk = createJfk({path: curExt})
  const mVersionStr = masterExtJfk.getV('version')
  const cVersionStr = curExtJfk.getV('version')

  // in multiple ext file version-bump, comparability is more important
  // so the non-masterBranch version-bump will based on original version without the +1 Patch number

  const v0 =  extractVersionStrNumber(mVersionStr) === extractVersionStrNumber(cVersionStr) ? cVersionStr : mVersionStr

  const nextVersion = versionBumpBranch({branch: curBranch,_versionStr: v0, digit: cliStore.getArgDefault('digit','patch'), type:'ext'})
  curExtJfk.setKV('version', nextVersion)
  curExtJfk.commit()
  const commitMsg = `VERSION: ${pjfk.getV('name')}@${nextVersion}`
  execSync(`git commit -i ${curExt} -m '${commitMsg}'`,{ stdio:'inherit' })
  return 
}

const getCurExtEff = () => {
  const pjfk = createPJFilekit({path: getCallPath()})
  const versionExtPathList = pjfk.getV<string[]>('VERISON_EXT_PATH')
  return versionExtPathList.find(i => basename(i,'.json') === curBranch)
}

export {
  versionBumpExt, getCurExtEff
}
