import { readFileSync, writeFileSync } from 'node:fs'

type ContentType = 'string' | 'json'
// type Json = object

type GetContent<T extends ContentType> = T extends 'string' ? string : object
type CreateFileKit4String = {
  readonly path: string
  rawStringContent?: string
  curContent?: string
  contentType?: 'string'
}

type CreateFileKit4Json = {
  readonly path: string
  rawStringContent?: string
  curContent?: object
  contentType?: 'json'
}

type CreateFileKit<T extends ContentType> = {
  readonly path: string
  rawStringContent?: string
  curContent?: GetContent<T>
  contentType?: T
}
// type CreateFileKit = CreateFileKit4String | CreateFileKit4Json
type ModifyFn = (fileContent:string)=>string

const createFileKit = <T extends ContentType>({ path, rawStringContent, curContent, contentType }:CreateFileKit<T>) => {
  let __rawFileString: string

  if (rawStringContent) {
    __rawFileString = rawStringContent
  } else {
    __rawFileString = readFileSync(path).toString()
  }

  let __modifiedFileContent: CreateFileKit<T>['curContent']
  if (curContent) {
    __modifiedFileContent = curContent
  } else {
    __modifiedFileContent = __rawFileString.slice()
  }

  const getRawString = () => {
    return __rawFileString
  }

  const modify = (modifyFn:ModifyFn, fileContent = __modifiedFileContent) => {
    if (__rawFileString === undefined) throw new Error('no such file')
    if (contentType === 'string') {
      __modifiedFileContent = modifyFn(fileContent.slice())
    } else {
      __modifiedFileContent = modifyFn(fileContent)
    }
  }

  const commit = () => {
    if (__modifiedFileContent === undefined) throw new Error('no file modified')
    if (contentType === 'string') {
      writeFileSync(path, __modifiedFileContent)
    } else if (contentType === 'json') {
      writeFileSync(path, JSON.stringify(__modifiedFileContent))
    }
  }

  const toJsonContent = () => {
    try {
      if (contentType === 'json') {
        return createFileKit<'json'>({ path, rawStringContent: __rawFileString, curContent: __modifiedFileContent })
      } else {
        return createFileKit<'json'>({ path, rawStringContent: __rawFileString, curContent: JSON.parse(__modifiedFileContent) })
      }
    } catch (e) {
      throw new Error('not json')
    }
  }

  const toStringContent = () => {
    try {
      if (contentType === 'json') {
        return createFileKit<'string'>({ path, rawStringContent: __rawFileString, curContent: JSON.stringify(__modifiedFileContent) })
      } else {
        return createFileKit<'string'>({ path, rawStringContent: __rawFileString, curContent: __modifiedFileContent })
      }
    } catch (e) {
      throw new Error('content error')
    }
  }

  return {
    getRawString,
    modify, commit,
    toJsonContent, toStringContent
  }
}
export {
  createFileKit
}
