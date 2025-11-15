import { LG } from '@blurname/core/src/colorLog.js'
import { getCurBranch, isMasterBranch } from '@blurname/core/src/node/git.js'
import { createPJFilekit, PJFK } from '@blurname/core/src/node/fileKit.js'
import {execSync} from 'node:child_process'


// type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0,
} as const
type Digit = keyof typeof DigitKV

const extractVersionStrNumber = (versionStr: string) => {
  return versionStr.split('-')[0]
}

const digitBump = (version: string, digit: Digit) => {
  const versionList = version.split('.')
  const digitNumber = DigitKV[digit]
  versionList[digitNumber] = `${Number(versionList[digitNumber]) + 1}`
  if(digit === 'minor') {
    versionList[DigitKV['patch']] = '0'
  } else if (digit === 'major'){
    versionList[DigitKV['patch']] = '0'
    versionList[DigitKV['minor']] = '0'
  } else {
    // not resolve patch
  }
  return versionList.join('.')
}

const versionBumpBranch = ({branch,_versionStr: versionStr, digit, type = 'single'}:{branch: string,_versionStr: string, digit: Digit, type?: 'single' | 'ext'}) => {
  let nextVersion = ''
  const versionNumberStr = extractVersionStrNumber(versionStr)
  if(isMasterBranch(branch)){
    nextVersion = digitBump(versionNumberStr, digit)
  } else {
    const branchSign = `-${branch.replace('/', '').replace('-', '')}`
    if(versionStr.includes(branchSign)){
      nextVersion = versionNumberStr + branchSign + '.' + (Number(versionStr.split('.').at(-1)) +1)
    }else{
      if(versionStr.includes('-')){
        nextVersion = versionNumberStr + branchSign + '.0'
      }else{
        const _numberList = versionNumberStr.split('.')
        const last = type === 'single'? String(Number(_numberList[2]) +1) : String(Number(_numberList[2])) 
        nextVersion = [_numberList[0],_numberList[1],last].join('.') + branchSign + '.0'
      }
    }
  }
  return nextVersion
}

const versionBump = (pjfk: PJFK,subPkgPathL: string[]) => async (digit: Digit) => {
  const branch = getCurBranch()
  
  const _versionStr = pjfk.getV('version')
  let nextVersion = versionBumpBranch({branch,_versionStr, digit})


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
    const content = ' ' + subPjfk.getPath().replace(rootPath, '')
    // temp-fix: skip this strange scenario
    if(content.trim() === '/package.json') continue
    subPackageJsonString += content
  }


  const commitMsg = `VERSION: ${pjfk.getV('name')}@${nextVersion}`
  execSync( `git commit -i package.json ${subPackageJsonString} -m '${commitMsg}'`,{ stdio:'inherit' })
  LG.success(commitMsg)
}

export type {
  Digit
}
export { 
  digitBump,
  versionBump, versionBumpBranch, 
  extractVersionStrNumber
}
