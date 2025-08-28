import { execSync } from 'node:child_process'
import { log } from 'node:console'
import { readFileSync, unlinkSync } from 'node:fs'
import { dirname } from 'node:path'

const logRemoteJsonDesc = 'log {url}.json senseless'
const logRemoteJson = () => {
  const url = process.argv[2]
  const logPath = `${dirname(process.argv[1])}/dlog`
  execSync(`wget -O ${logPath} ${url}`)
  const dlogContent = readFileSync(logPath).toString()
  unlinkSync(logPath) // 轻轻的我走了，正如我轻轻的来，我挥一挥衣袖，不带走一片云彩
  const dlog = JSON.parse(dlogContent)
  log(dlog)
}
export { logRemoteJson, logRemoteJsonDesc }
