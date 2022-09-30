import { exec } from '../core'
const computeWorkingTime = async () => {
  const [path1, path2, _, inputTime] = process.argv
  const realTime = inputTime ?? '09:00'
  const { stdout: time } = await exec('timedatectl status')
  const local = time.split('\n')[0]
  const dateIndex = local.indexOf(':')
  const stdTime = local.slice(dateIndex + 1).trim()
  const month = stdTime.split(' ')[1]
  const beginTime = `${month} ${realTime}:00 CST`
  console.log('beginTime:', beginTime)
  console.log('stdTime:', stdTime)
  const hours = ((new Date(stdTime).getTime() - new Date(beginTime).getTime()) / 1000 / 60 - 40) / 60
  console.log('working hours:', hours)
}
export { computeWorkingTime }
