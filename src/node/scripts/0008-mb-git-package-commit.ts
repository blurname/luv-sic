import { execSync } from 'node:child_process'

const packageNameMap = {
  fake: 'fake',
}

const main = () => {
  const stdout = execSync('git diff | grep @mockingbot')
  const packageJsonContent = stdout.toString()
  const commitMessage = packageJsonContent
    .split('\n')
    .filter((s) => s.startsWith('+'))
    .reduce((pre, cur, index) => {
      const parts = cur.split(':')
      const pacakgeName = packageNameMap[parts[0].split('+')[1].trim().split('"')[1]]
      const packageVersion = parts[1].split('"')[1]
      const nameVersion = `${pacakgeName}@${packageVersion}`
      if (index === 0) {
        return `${pre} ${nameVersion}`
      }
      return `${pre}&${nameVersion}`
    }, 'UPG:')
    .trimEnd()
  console.log(commitMessage)
  const stdout2 = execSync(`git commit -i package.json -m '${commitMessage}'`)
  console.log(stdout2.toString())
}

main()
