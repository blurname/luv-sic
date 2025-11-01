import { execSync, spawnSync } from 'node:child_process'
import { createPJFilekit, PJFK } from '@blurname/core/src/node/fileKit.js'
import { LG } from '@blurname/core/src/colorLog.js'

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

export { pkgPublish, isTagCreatedEff, createTagPush }
