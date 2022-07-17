import { exec } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { stat, access, rename } from 'node:fs/promises'
import { promisify } from 'util'
const pExec = promisify(exec)
export {
  pExec as exec,
  stat,
  access,
  rename,
  writeFile
}
