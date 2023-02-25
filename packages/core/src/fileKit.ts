import { readFileSync, writeFileSync } from 'node:fs'

// TODO: better type design
type ContentType = 'string' | 'json'
type Json = object

type GetContent<T extends ContentType> = T extends 'string' ? string : object

// type CreateFileKit<T extends ContentType> = {
// readonly path: string
// rawStringContent?: string
// contentType: T
// curContent?: GetContent<T>
// }
type CreateFileKit4String = {
  readonly path: string
  contentType?: 'json'
  rawStringContent?: string
  curContent?: object
}
type CreateFileKit4Json = {
  readonly path: string
  contentType?: 'string'
  rawStringContent?: string
  curContent?: string
}
 type CreateFileKit = CreateFileKit4String | CreateFileKit4Json
type ModifyFn<T extends ContentType> = (fileContent: GetContent<T>)=>string

const createFileKit = ({ path, rawStringContent, curContent, contentType = 'string' }:CreateFileKit) => {
  let __rawFileString: string

  if (rawStringContent) {
    __rawFileString = rawStringContent
  } else {
    __rawFileString = readFileSync(path).toString()
  }

  let __modifiedFileContent: GetContent<typeof contentType>
  if (curContent) {
    __modifiedFileContent = curContent
  } else {
    __modifiedFileContent = __rawFileString.slice()
  }

  const getRawString = () => {
    return __rawFileString
  }

  const modify = (modifyFn:ModifyFn<typeof contentType>, fileContent = __modifiedFileContent) => {
    if (__rawFileString === undefined) throw new Error('no such file')
    if (contentType === 'string') {
      __modifiedFileContent = modifyFn(fileContent as string)
    } else {
      __modifiedFileContent = modifyFn(fileContent as object)
    }
  }

  const commit = () => {
    if (__modifiedFileContent === undefined) throw new Error('no file modified')
    if (contentType === 'string') {
      writeFileSync(path, __modifiedFileContent as string)
    } else if (contentType === 'json') {
      writeFileSync(path, JSON.stringify(__modifiedFileContent))
    }
  }

  const toJsonContent = () => {
    try {
      if (contentType === 'json') {
        return createFileKit({ path, rawStringContent: __rawFileString, curContent: __modifiedFileContent as Json, contentType: 'json' })
      } else {
        return createFileKit({ path, rawStringContent: __rawFileString, curContent: JSON.parse(__modifiedFileContent as string), contentType: 'json' })
      }
    } catch (e) {
      throw new Error('not json')
    }
  }

  const toStringContent = () => {
    try {
      if (contentType === 'json') {
        return createFileKit({ path, rawStringContent: __rawFileString, curContent: JSON.stringify(__modifiedFileContent), contentType: 'string' })
      } else {
        return createFileKit({ path, rawStringContent: __rawFileString, curContent: __modifiedFileContent as string, contentType: 'string' })
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
