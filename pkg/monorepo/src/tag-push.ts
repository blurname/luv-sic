import { execSync, spawnSync } from 'node:child_process'
import { createJfk, createPJFilekit, PJFK } from '@blurname/core/src/node/fileKit.js'
import { LG } from '@blurname/core/src/colorLog.js'
import {getCurBranch} from '@blurname/core/src/node/git.js'
import {basename} from 'node:path'
import {createCliStoreEff} from '@blurname/core/src/node/cli.js'

const isTagCreatedEff = (versionStr: string) => {
  const res = spawnSync('git',['tag','-v',versionStr]).output.toString()
  if(res.includes("tagger")){
    LG.error(`tag ${versionStr} is created`)
    return true // if a tag is created, there must be a tagger
  } 
  return false
}

// TODO: bl: remain git tag
const pkgPublish = async (pkgPath: string) => {
    const pjfk = createPJFilekit({ path: pkgPath })
    if (pjfk.getV('private')) return
    try {
      execSync(`cd ${pkgPath} && npm publish`)
    } catch (e) {
      console.warn(e)
    }
}

const createTagPush = async (pjfk: PJFK) => {
  const versionStr = pjfk.getV('version')
  const tagVersion = 'v' + versionStr
  if(isTagCreatedEff(tagVersion)) return 
  spawnSync('git', ['tag', '-a', tagVersion, '-m', ''])
  spawnSync('git', ['push'])
  spawnSync('git', ['push','origin', tagVersion])
}

const createTagPushExtEff = async (pjfk: PJFK) => {

  const versionExtPathList = pjfk.getV<string[]>('VERISON_EXT_PATH')
  const cliStore = createCliStoreEff({
    arg: {
      'branch': { desc: 'specific branch', type:'string'},
      'remote': { desc: 'remote url', type:'string'},
      'head': { desc: 'remote head', type:'string'},
    }
  })
  const remote = cliStore.getArg('remote')
  const curBranch = cliStore.getArgDefault('branch', getCurBranch())
  const curExt = versionExtPathList.find(i => basename(i,'.json') === curBranch)!
  const versionStr = createJfk({path: curExt}).getV('version')

  const tagVersion = 'v' + versionStr
  if(isTagCreatedEff(tagVersion)) return 
  spawnSync('git', ['tag', '-a', tagVersion, '-m', ''])
  if(remote){
    const head = cliStore.getArg('head')
    spawnSync('git', ['push', remote, head]) // push the brnach
    spawnSync('git', ['push', remote, head, tagVersion]) // push the tag
  }else {
    spawnSync('git', ['push']) // push the brnach
    spawnSync('git', ['push','origin', tagVersion]) // push the tag
  }
}

export { 
  pkgPublish, isTagCreatedEff,
  createTagPush, createTagPushExtEff 
}
