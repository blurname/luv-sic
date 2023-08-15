import { execSync } from 'node:child_process'

const getGitRootPath = () => {
  const rootPath = execSync('git rev-parse --show-toplevel').toString().split('\n')[0]
  return rootPath
}

export {
  getGitRootPath
}
