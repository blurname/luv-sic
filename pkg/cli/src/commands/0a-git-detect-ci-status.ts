import { execSync } from 'node:child_process'

const detectCIStatusDesc = 'use glab to detect gitlab CI status'
const detectCIStatus = async () => {
  let CIStatus = 'go'
  const version = execSync('git log --oneline | grep VERSION -m 1')
    .toString()
    .split('\n')[0]
    .split('@')
    .at(-1)
  while (CIStatus === 'go') {
    console.log('月球漫步中')
    await sleep(15000)
    const status = execSync(`glab ci list | grep ${version} -m 1 `).toString()
    if (status.includes('success')) {
      CIStatus = 'success'
      console.log(`${version} 通过啦\n马路上天天都在塞，每个人天天在忍耐`)
      break
    }
    if (status.includes('failed')) {
      CIStatus = 'failed'
      throw new Error(
        `${version} 没有通过。。。\n痛，太痛了！\n难受，太难受了！`
      )
    }
  }
}
const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export { detectCIStatus, detectCIStatusDesc }
