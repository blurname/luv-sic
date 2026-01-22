import { spawnSync } from "node:child_process"

export const getCurBranch = () => spawnSync('git', ['branch', '--show-current']).stdout.toString().trim()
export const isMasterBranch = (branch: string) => branch === 'master' || branch === 'main' || branch === 'release'
