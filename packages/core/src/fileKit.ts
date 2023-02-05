import {readFile, writeFile} from 'node:fs/promises'

const createFileKit = async (path:string)=>{
  let __rawFile = (await readFile(path)).toString()
  let __modifiedFile : string | undefined

  const rFile =() => {
    return __rawFile
  }

  const mFile = (modifyFn:(fileContent:any)=>string) =>{
    if(__rawFile === undefined) throw new Error('no such file')
    __modifiedFile = modifyFn(__rawFile.slice())
  }

  const wFile = async () => {
    if(__modifiedFile === undefined) throw new Error('no file modified')
    await writeFile(path,__modifiedFile)
  }

  return {
    rFile,
    mFile,
    wFile
  }
}
export {
  createFileKit
}
