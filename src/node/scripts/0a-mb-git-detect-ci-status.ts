import { execSync } from 'node:child_process'
const main = async () => {
  let CIStatus = 'go'
  const version = execSync('git log --oneline | grep VERSION -m 1').toString().split('\n')[0].split('@').at(-1)
  while (CIStatus === 'go') {
    console.log('月球漫步中')
    await sleep(30000)
    const status = execSync(`glab ci list | grep ${version} -m 1 `).toString()
    if (status.includes('success')) {
      CIStatus = 'success'
      console.log(`${version} 通过啦，飞流直下三千尺，疑是银河落九天!`)
      break
    }
    if (status.includes('failed')) {
      CIStatus = 'failed'
      throw new Error(`${version} 没有通过。。。\n痛，太痛了！\n难受，太难受了！`)
    }
  }
}
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
main()
