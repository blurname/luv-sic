import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { createFileKit } from '@blurname/core/src/node/fileKit.js'

// TODO: bl: remain git tag
const tagPush = async (subPackageList: string[]) => {
  const pathDir = dirname(process.argv[1]) // repo/script: script exec path
  const rootPath = resolve(...[pathDir, '..']) // repo/pkg: same level with script

  // const changedList: string[] = []
  for (const pkg of subPackageList) {
    const subPath = rootPath + `/pkg/${pkg}`
    const fileKit = createFileKit(rootPath + `/pkg/${pkg}/package.json`)
    const fileString = fileKit.getFileContent()
    const fileJson = JSON.parse(fileString)
    if (fileJson.private) continue
    try {
      execSync(`cd ${subPath} && npm publish`)
    } catch (e) {
      console.warn(e)
    }
    // changedList.push(`${fileJson.name}@${fileJson.version}`)
    // fileKit.getFileContent()
    // fileKit.commit()
  }
  // execSync(`git tag ${tag}`)
}

export { tagPush }
