import {fileURLToPath} from 'node:url'
import {dirname,resolve} from 'node:path'
import { createFileKit } from '../packages/core/src/fileKit.js'
import {colorLog} from '../packages/core/src/colorLog.js'

type Version = `${number}.${number}.${number}`

const DigitKV = {
  patch: 2,
  minor: 1,
  major: 0
} as const
type Digit = keyof typeof DigitKV

const subPackageList = ['core','cli']

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

  const __changVersion = async (packageJsonPath:string) => {
    const fileKit = await createFileKit(packageJsonPath)
    fileKit.mFile((fileString)=>{
      const fileJson = JSON.parse(fileString)
      fileJson.version = digitBump(fileJson.version,digit)
      console.log(colorLog({msg:fileJson.version,fg:'Red'}))
      return JSON.stringify(fileJson,null,2)
    })
    fileKit.wFile()
  }

  await __changVersion(rootPackageJsonPath)
  for (const pkg of subPackageList) {
    __changVersion(rootPath+`/packages/${pkg}/package.json`)
  }
}

export {
  versionBump
}

versionBump('patch')
//versionBump('minor')
//versionBump('major')
