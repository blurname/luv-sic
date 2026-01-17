import { execSync, spawnSync } from 'node:child_process'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { colorLog } from '@blurname/core/src/colorLog'
import { parseOptionList } from '@blurname/core/src/node/cli'

const gitReplacePackageDesc = 'replace package version in  package.json'

let options: Record<string, string> = {
  t: 'imock',
}

const gitReplacePackage = async () => {
  // let targetRepo
  const argv = process.argv
  options = parseOptionList(argv, options)

  try {
    await stat(`../${options['t']}`)
  } catch (_) {
    console.log(`${colorLog({ msg: 'repo 目录错啦', fg: 'Red' })}`)
    return
  }

  const logOut = execSync('git log --oneline | grep VERSION -m 1').toString()
  const content = logOut.split('\n')[0]
  const versionCommit = content.split('@').at(-1)
  const pwdout = execSync('pwd').toString()
  const repoName = pwdout.split('/').at(-1)!.split('\n')[0]
  const packageName = repoName

  const packageJsonContent = (await readFile(`../${options['t']}/package.json`))
    .toString()
    .split('\n')
    .reverse()
  const pos = packageJsonContent.findIndex((s) => s.includes(packageName))
  const targetContent = packageJsonContent.find((s) => s.includes(packageName))
  if (targetContent === undefined) return
  const [name, version] = targetContent.split(':')

  const hasComma = version.split(',').length > 1

  const finalContent = `${name}: "${versionCommit}"${hasComma ? ',' : ''}`
  packageJsonContent[pos] = finalContent
  const writeContent = packageJsonContent.reverse().join('\n')
  await writeFile(`../${options['t']}/package.json`, writeContent)
  console.log(
    `已将 ${colorLog({ msg: options['t'], fg: 'Yellow' })} 下的 ${colorLog({
      msg: repoName,
      fg: 'Yellow',
    })} 版本号修改`
  )
  console.log(colorLog({ msg: '结果', fg: 'Green' }))

  spawnSync('git', ['--no-pager', 'diff', 'package.json'], {
    cwd: `../${options['t']}`,
    stdio: 'inherit',
  })
}
export { gitReplacePackage, gitReplacePackageDesc }
