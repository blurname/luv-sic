import {spawnSync} from "node:child_process"

const getCurBranch = () => {
  return spawnSync('git',['branch','--show-current']).stdout.toString().trim()
}
const isMasterBranch = (branch: string) => {
  return branch === 'master' || branch === 'main' || branch === 'release'
}

export {
  getCurBranch, isMasterBranch
}
