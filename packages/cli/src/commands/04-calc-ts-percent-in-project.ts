import { execSync } from 'node:child_process'
const calcTsPercentInProjectDesc = 'calc .ts/.ts+.js in project'
const calcTsPercentInProject = async () => {
  const ts = execSync('fd .ts').toString()
  const js = execSync('fd .js').toString()
  const tsSize = ts.split('\n').length - 1
  const jsSize = js.split('\n').length - 1
  const percent = (tsSize / (tsSize + jsSize)) * 100
  console.log(`${percent}%`)
}
export { calcTsPercentInProject, calcTsPercentInProjectDesc }
