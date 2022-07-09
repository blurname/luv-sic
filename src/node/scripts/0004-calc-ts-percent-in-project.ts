import { exec } from '../core'
const calcTsPercentInProject = async() => {
  const {stdout: ts } = await exec('fd .ts')
  const {stdout: js } = await exec('fd .js')
  const tsSize = ts.split('\n').length-1
  const jsSize = js.split('\n').length-1
  const percent = tsSize/(tsSize+jsSize)*100
  console.log(`${percent}%`)
}
export {
  calcTsPercentInProject
}
