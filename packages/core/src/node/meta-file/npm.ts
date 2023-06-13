import { fileURLToPath } from 'url'
import { createFileKit } from '../../fileKit.js'
import { dirname, resolve } from 'path'
const getPackageJsonFile = (path: string) => {
  const fileKit = createFileKit(path)
  return fileKit
}
export {
  getPackageJsonFile
}
