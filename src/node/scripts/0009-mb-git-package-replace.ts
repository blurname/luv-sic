import { exec, spawn } from 'node:child_process'
import { readFile, writeFile, stat } from 'node:fs/promises'
import { promisify } from 'node:util'
const pExec = promisify(exec)
const pSpawn = promisify(spawn)

const main = async () => {
  let targetRepo
  const argv = process.argv

  if (argv.length > 3) {
    console.log('arg error')
  } else if (argv.length === 3) {
    targetRepo = argv.at(-1)
  } else {
    targetRepo = 'imock'
  }

  try {
    await stat(`../${targetRepo}`)
  } catch (_) {
    console.log(`${colorLog('repo 目录错啦', FgRed)}`)
    return
  }

  const { stdout: logOut } = await pExec('git log --oneline | grep VERSION -m 1')
  const content = logOut.toString().split('\n')[0]
  const versionCommit = content.split('@').at(-1)
  const { stdout: pwdOut } = await pExec('pwd')
  if (pwdOut === undefined) return
  const repoName = pwdOut.toString().split('/').at(-1)!.split('\n')[0]
  const packageName = repoName

  const packageJsonContent = (await readFile(`../${targetRepo}/package.json`)).toString().split('\n').reverse()
  const pos = packageJsonContent.findIndex((s) => s.includes(packageName))
  const targetContent = packageJsonContent.find((s) => s.includes(packageName))
  if (targetContent === undefined) return
  const [name, version] = targetContent.split(':')

  const hasComma = version.split(',').length > 1

  const finalContent = `${name}: "${versionCommit}"${hasComma ? ',' : ''}`
  packageJsonContent[pos] = finalContent
  const writeContent = packageJsonContent.reverse().join('\n')
  await writeFile(`../${targetRepo}/package.json`, writeContent)
  console.log(`已将 ${colorLog(targetRepo)} 下的 ${colorLog(repoName)} 版本号修改`)
  console.log(`${FgGreen}结果${Reset}`)

  await pSpawn('git', ['diff'], { cwd: `../${targetRepo}`, stdio: 'inherit' })
}
main()

const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'
const Reset = '\x1b[0m'
const FgYellow = '\x1b[33m'
const colorLog = (msg, fg = FgYellow, bg = '') => {
  return `${fg}${bg}${msg}${Reset}`
}
