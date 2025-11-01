import {LG} from '@blurname/core/src/colorLog.js'
import { createPJFilekit, PJFK } from '@blurname/core/src/node/fileKit.js'
import {execSync} from 'node:child_process'

// type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0,
} as const
type Digit = keyof typeof DigitKV

const digitBump = (version: string, digit: Digit) => {
  const versionList = version.split('.')
  const digitNumber = DigitKV[digit]
  versionList[digitNumber] = `${Number(versionList[digitNumber]) + 1}`
  return versionList.join('.')
}

const versionBump = (pjfk: PJFK,subPkgPathL: string[]) => async (digit: Digit) => {
  const _versionStr = pjfk.getV('version')
  const nextVersion = digitBump(_versionStr, digit)
  pjfk.setKV('version', nextVersion)
  pjfk.commit()

  const rootPathList = pjfk.getPath().split('/')
  rootPathList.pop()
  const rootPath = rootPathList.join('/') + '/' 

  let subPackageJsonString = ''
  for (const pkgPath of subPkgPathL) {
    const subPjfk = createPJFilekit({path: pkgPath})
    subPjfk.setKV('version', nextVersion)
    subPjfk.commit()
    subPackageJsonString += ' ' + subPjfk.getPath().replace(rootPath, '')
  }


  const commitMsg = `VERSION: ${pjfk.getV('name')}@${nextVersion}`
  execSync(
    `git commit -i package.json ${subPackageJsonString} -m '${commitMsg}'`
  )
  LG.success(commitMsg)
}

export { versionBump }
