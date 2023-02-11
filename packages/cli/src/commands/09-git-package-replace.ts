import { parseOptionList } from '@blurname/core/src/cli'
import { colorLog } from '@blurname/core/src/colorLog'
import { exec as pExec, pSpawn } from '@blurname/core/src/core'
import { readFile, writeFile, stat } from 'node:fs/promises'

const gitReplacePackageDesc = `replace package version in  package.json`

let options: Record<string, string> = {
  t: 'imock',
}

const gitReplacePackage = async () => {
  //let targetRepo
  const argv = process.argv
  options = parseOptionList(argv, options)

  try {
    await stat(`../${options['t']}`)
  } catch (_) {
    console.log(`${colorLog({ msg: 'repo 目录错啦', fg: 'Red' })}`)
    return
  }

  const { stdout: logOut } = await pExec('git log --oneline | grep VERSION -m 1')
  const content = logOut.toString().split('\n')[0]
  const versionCommit = content.split('@').at(-1)
  const { stdout: pwdOut } = await pExec('pwd')
  if (pwdOut === undefined) return
  const repoName = pwdOut.toString().split('/').at(-1)!.split('\n')[0]
  const packageName = repoName

  const packageJsonContent = (await readFile(`../${options['t']}/package.json`)).toString().split('\n').reverse()
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
    })} 版本号修改`,
  )
  console.log(colorLog({ msg: '结果', fg: 'Green' }))

  await pSpawn('git', ['--no-pager', 'diff', 'package.json'], { cwd: `../${options['t']}`, stdio: 'inherit' })
}
export { gitReplacePackage, gitReplacePackageDesc }
