import { createFileKit } from '../../fileKit.js'
const getPackageJsonFile = (path: string) => {
  const fileKit = createFileKit(path)
  return fileKit
}
export {
  getPackageJsonFile
}
