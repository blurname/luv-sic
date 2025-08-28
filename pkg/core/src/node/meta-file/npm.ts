import { createFileKit } from '../fileKit.js'

const getPackageJsonFile = () => {
  const path = process.cwd() + '/package.json'
  const fileKit = createFileKit(path)
  return fileKit
}
export { getPackageJsonFile }
