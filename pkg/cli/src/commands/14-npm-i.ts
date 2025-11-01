import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createCommand } from '../util/createCommand.js'
import {getCallPath} from '@blurname/core/src/node/cli.js'

const npmInstall = createCommand({
  desc: 'npm yarn pnpm detect install',
  command: () => {
    const callPath = getCallPath()
    if (fs.existsSync(path.join(callPath, 'pnpm-lock.yaml'))) {
      spawnSync('pnpm', ['i'], { stdio: 'inherit' })
    } else if (fs.existsSync(path.join(callPath, 'yarn.lock'))) {
      spawnSync('yarn', { stdio: 'inherit' })
    } else {
      execSync('npm i', { stdio: 'inherit' })
    }
    return 1
  },
})
export { npmInstall }
