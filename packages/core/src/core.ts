import { exec, spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { stat, access, rename } from 'node:fs/promises'
import { promisify } from 'util'
const pExec = promisify(exec)
const pSpawn = promisify(spawn)
export { pExec as exec,pSpawn, stat, access, rename, writeFile }
