import { execSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'

const main = async () => {
  const content = execSync('git log --oneline').toString().split('\n')
  const versionCommit = content.find((c) => c.includes('VERSION')).split('@')[2]
  const repoName = execSync('pwd').toString().split('/').at(-1).split('\n')[0]

  const packageJsonContent = (await readFile('../imock/package.json')).toString().split('\n')
  const pos = packageJsonContent.findIndex((s) => s.includes(repoName))

  const targetContent = packageJsonContent.find((s) => s.includes(repoName))
  const [name, version] = targetContent.split(':')

  const hasComma = version.split(',').length > 1

  const finalContent = `${name}: "${versionCommit}"${hasComma ? ',' : ''}`
  packageJsonContent[pos] = finalContent
  const writeContent = packageJsonContent.join('\n')
  await writeFile('../imock/package.json', writeContent)
}

main()
