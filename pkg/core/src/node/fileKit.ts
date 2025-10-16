import { existsSync, readFileSync, writeFileSync,readdirSync } from 'node:fs'
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
type PJFK = ReturnType<typeof createPJFilekit>

const findDownPkg = (pjfk: PJFK) => {
  const cwd = process.cwd()
  const subPkgPathList = []
  for (const workspace of pjfk.getV<string[]>("workspaces")) {
    if(workspace.endsWith('/*')){
      const path1 = PATH.join(cwd,workspace.split("/*")[0])
      for (const subPkg of readdirSync(path1)) {
        subPkgPathList.push(PATH.join(path1,subPkg))
      }
    }else {
      subPkgPathList.push(PATH.join(cwd,workspace))
    }
  }
  return subPkgPathList
}
export { createFileKit, createPJFilekit, findDownPkg }
