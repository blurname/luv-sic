import { createPJFilekit } from "../fileKit.js"

const getPackageJsonFile = () => {
  const path = process.cwd() + '/package.json'
  const fileKit = createPJFilekit({path})
  return fileKit
}
export { getPackageJsonFile }
