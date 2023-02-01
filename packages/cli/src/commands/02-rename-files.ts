import { exec, rename } from '@blurname/core/src/core'
const renameFile = async () => {
  const [path1, path2, ...path3] = process.argv
  console.log(path3)
  const { stdout } = await exec('ls')
  console.log(stdout)
}
// renameFile()
// export {

// }
