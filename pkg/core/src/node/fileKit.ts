import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import PATH from 'node:path'

const createFileKit = (path: string) => {
  const _rawFile = readFileSync(path).toString()
  let _modifiedFile: string | undefined

  const modify = (modifyFn: (fileString: string) => string) => {
    if (_rawFile === undefined) throw new Error('no such file')
    _modifiedFile = modifyFn(_rawFile.slice())
  }

  const commit = () => {
    if (_modifiedFile === undefined) throw new Error('no file modified')
    writeFileSync(path, _modifiedFile)
  }

  const getFileContent = () => {
    return _rawFile
  }

  return {
    modify,
    commit,
    getFileContent,
  }
}

const findUpPackageJson = () => {
  let nextPath = process.cwd()
  let packageJsonPath: string | undefined
  while(nextPath !== '/' && packageJsonPath === undefined){
    const filePath = nextPath + "/package.json"
    console.log('🟦[blue]->filePath: ', filePath)
    if(existsSync(filePath)){
      packageJsonPath = filePath
      break
    }
    nextPath = PATH.join(nextPath,"../")
  }
  if(!packageJsonPath) throw new Error(" no package.json")
  return packageJsonPath 
}

// pj := packgae.json
type CreatePJFilekitProps = {
  // path: string
}

const createPJFilekit = ({}: CreatePJFilekitProps) => {
  const path = findUpPackageJson()
  // if(PATH.extname(path) !== 'json') throw new Error("not a json file")
  const fk = createFileKit(path)
  const _jsonKV = JSON.parse(fk.getFileContent())
  const getJson = () => {
    return _jsonKV
  }

  const getV = <T = string>(key: string): T => {
    return _jsonKV[key]
  }

  const setKV = (key: string, value: string | number | null ) => {
    _jsonKV[key] = value
    fk.modify(()=>JSON.stringify(_jsonKV))
  }

 return {
   ...fk,
   getV,
   setKV,
   getJson
 } 
}
export { createFileKit, createPJFilekit }
