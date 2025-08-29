import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { createFileKit } from '@blurname/core/src/node/fileKit.js'

type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0,
} as const
type Digit = keyof typeof DigitKV

const digitBump = (version: Version, digit: Digit) => {
  const versionList = version.split('.')
  const digitNumber = DigitKV[digit]
  versionList[digitNumber] = `${Number(versionList[digitNumber]) + 1}`
  return versionList.join('.')
}

const versionBump = (subPkgList: string[]) => async (digit: Digit) => {
  const pathDir = dirname(process.argv[1]) // repo/script: script exec path
  const rootPath = resolve(...[pathDir, '..']) // repo/pkg: same level with script

  const changedList: string[] = []

  for (const pkg of subPkgList) {
    const fileKit = createFileKit(rootPath + `/pkg/${pkg}/package.json`)
    fileKit.modify((fileString) => {
      const fileJson = JSON.parse(fileString)
      const version = digitBump(fileJson.version, digit)
      changedList.push(`${fileJson.name}@${version}`)
      fileJson.version = version
      return JSON.stringify(fileJson, null, 2)
    })
    fileKit.commit()
  }

  const commitMsg = `VERSION: ${changedList.join('; ')}`
  const subPackageJsonString = subPkgList.reduce(
    (pre, cur) => `${pre} pkg/${cur}/package.json`,
    ''
  )
  execSync(
    `git commit -i package.json ${subPackageJsonString} -m '${commitMsg}'`
  )
}

export { versionBump }

// versionBump('patch')
// versionBump('minor')
// versionBump('major')
