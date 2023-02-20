import {fileURLToPath} from 'node:url'
import {dirname,resolve} from 'node:path'
import { createFileKit } from '../packages/core/src/fileKit.js'
import {execSync} from 'node:child_process'

type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0
} as const
type Digit = keyof typeof DigitKV

const subPackageList = ['core','cli','svgminify']

const digitBump = (version:Version,digit:Digit) => {
  const versionList = version.split('.') 
  const digitNumber = DigitKV[digit]
  versionList[digitNumber] = `${Number(versionList[digitNumber]) + 1}`
  return versionList.join('.')
}

const versionBump = async (digit:Digit) => {
  const pathDir = dirname(fileURLToPath(import.meta.url))
  const rootPath = resolve(...[pathDir,'..',])
  const rootPackageJsonPath = rootPath + '/package.json'

  const fileKit = await createFileKit(rootPackageJsonPath)

  let newVersion:string |undefined

  fileKit.mFile((fileString:string)=>{
    const fileJson = JSON.parse(fileString)
    fileJson.version = digitBump(fileJson.version,digit)
    newVersion = fileJson.version.slice()
    return JSON.stringify(fileJson,null,2)
  })
  await fileKit.wFile()

  for (const pkg of subPackageList) {
    const fileKit = await createFileKit(rootPath+`/packages/${pkg}/package.json`)
    fileKit.mFile((fileString) => {
      const fileJson = JSON.parse(fileString)
      fileJson.version = newVersion
      return JSON.stringify(fileJson,null,2)
    })
    await fileKit.wFile()
  }

  const commitMsg = `VERSION: @blurname/blurkit@${newVersion}`
  const subPackageJsonString = subPackageList.reduce((pre,cur) => `${pre} packages/${cur}/package.json` ,'')
  execSync(`git commit -i package.json ${subPackageJsonString} -m '${commitMsg}'`)
}

export {
  versionBump
}

versionBump('patch')
//versionBump('minor')
//versionBump('major')
