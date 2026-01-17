import { createPJFilekit } from "../fileKit"

const getPackageJsonFile = () => {
  const path = process.cwd() + '/package.json'
  const fileKit = createPJFilekit({path})
  return fileKit
}
export { getPackageJsonFile }
