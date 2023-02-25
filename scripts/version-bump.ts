import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createFileKit } from '../packages/core/src/fileKit.js'
import { execSync } from 'node:child_process'

const subPackageList = [ 'core', 'cli', 'svgminify' ]

type Version = `${number}.${number}.${number}`
const DIGIT_MAP = {
  patch: 2,
  minor: 1,
  major: 0
} as const
type Digit = keyof typeof DIGIT_MAP

const versionBump = async (digit:Digit) => {
  const __digitBump = (version:Version, digit:Digit) => {
    const versionList = version.split('.')
    const digitNumber = DIGIT_MAP[ digit ]
    versionList[ digitNumber ] = `${Number(versionList[ digitNumber ]) + 1}`
    return versionList.join('.')
  }

  const pathDir = dirname(fileURLToPath(import.meta.url))
  const rootPath = resolve(...[ pathDir, '..' ])
  const rootPackageJsonPath = rootPath + '/package.json'

  const fileKit = createFileKit({ path: rootPackageJsonPath })

  let newVersion:string |undefined

  fileKit.modify((stringContent) => {
    const fileJson = JSON.parse(stringContent)
    fileJson.version = __digitBump(fileJson.version, digit)
    newVersion = fileJson.version.slice()
    return JSON.stringify(fileJson, null, 2)
  })
  fileKit.commit()

  for (const pkg of subPackageList) {
    const fileKit = createFileKit({ path: rootPath + `/packages/${pkg}/package.json` })
    fileKit.modify((stringContent) => {
      const fileJson = JSON.parse(stringContent)
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

versionBump('patch')
// versionBump('minor')
// versionBump('major')
