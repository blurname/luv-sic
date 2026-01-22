import { createPJFilekit } from "../fileKit"

export const getPackageJsonFile = () => createPJFilekit({ path: process.cwd() })
