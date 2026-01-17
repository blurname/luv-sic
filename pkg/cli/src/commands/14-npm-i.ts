import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {getCallPath} from '@blurname/core/src/node/cli'
import {createCommand } from '@blurname/core/src/node/command'

const npmInstall = createCommand({
  desc: 'npm yarn pnpm detect install',
  fn: () => {
    const callPath = getCallPath()
    if (fs.existsSync(path.join(callPath, 'pnpm-lock.yaml'))) {
      spawnSync('pnpm', ['i'], { stdio: 'inherit' })
    } else if (fs.existsSync(path.join(callPath, 'bun.lock'))) {
      execSync('bun i', { stdio: 'inherit' })
    } else if (fs.existsSync(path.join(callPath, 'yarn.lock'))) {
      spawnSync('yarn', { stdio: 'inherit' })
    } else {
      execSync('npm i', { stdio: 'inherit' })
    }
    return 1
  },
})
export { npmInstall }
