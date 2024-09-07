import { execSync } from 'node:child_process'

const duCurrentFolderDesc = "list current folders' nodes' size"
const duCurrentFolder = async () => {
  const stdout = execSync('ls').toString()
  const files = stdout.split('\n').filter((n) => n !== '')

  // get filesize
  const fileSizes = files.map(async (n) => {
    const size = execSync(`du -sh ${n}`).toString()
    return size
  })

  // log them
  fileSizes.forEach(async (n) => {
    const size = await n
    console.log(size.split('\n')[0])
  })
}
export { duCurrentFolder, duCurrentFolderDesc }
