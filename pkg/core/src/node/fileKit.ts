import { readFileSync, writeFileSync } from 'node:fs'

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
export { createFileKit }
