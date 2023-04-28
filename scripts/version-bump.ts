import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createFileKit } from '../packages/core/src/fileKit.js'
import { execSync } from 'node:child_process'

type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0
} as const
type Digit = keyof typeof DigitKV

const digitBump = (version:Version, digit:Digit) => {
  const versionList = version.split('.')
  const digitNumber = DigitKV[digit]
  versionList[digitNumber] = `${Number(versionList[digitNumber]) + 1}`
  return versionList.join('.')
}

const versionBump = (subPackageList:string[]) => async (digit:Digit) => {
  const pathDir = dirname(fileURLToPath(import.meta.url))
  const rootPath = resolve(...[pathDir, '..'])
  const rootPackageJsonPath = rootPath + '/package.json'

  const fileKit = createFileKit(rootPackageJsonPath)

  let newVersion:string |undefined

  fileKit.modify((fileString) => {
    const fileJson = JSON.parse(fileString)
    fileJson.version = digitBump(fileJson.version, digit)
    newVersion = fileJson.version
    return JSON.stringify(fileJson, null, 2)
  })
  fileKit.commit()

  for (const pkg of subPackageList) {
    const fileKit = createFileKit(rootPath + `/packages/${pkg}/package.json`)
    fileKit.modify((fileString) => {
      const fileJson = JSON.parse(fileString)
      fileJson.version = newVersion
      return JSON.stringify(fileJson, null, 2)
    })
    fileKit.commit()
  }

  const commitMsg = `VERSION: @blurname/blurkit@${newVersion}`
  const subPackageJsonString = subPackageList.reduce((pre, cur) => `${pre} packages/${cur}/package.json`, '')
  execSync(`git commit -i package.json ${subPackageJsonString} -m '${commitMsg}'`)
}

export {
  versionBump
}

// versionBump('patch')
// versionBump('minor')
// versionBump('major')
