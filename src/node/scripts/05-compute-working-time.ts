import { exec } from '../core'
const computeWorkingTimeDesc = 'computing my Saturday working time'
const computeWorkingTime = async () => {
  const [path1, path2, _, inputTime] = process.argv
  const realTime = inputTime ?? '09:00'

  const { stdout: time } = await exec('timedatectl status')

  const local = time.split('\n')[0]
  const dateIndex = local.indexOf(':')
  const stdTime = local.slice(dateIndex + 1).trim()
  const month = stdTime.split(' ')[1]

  const beginTime = `${month} ${realTime}:00 CST`
  // minus 12:00 - 13:30, 6:00 - 6:40
  const hours = ((new Date(stdTime).getTime() - new Date(beginTime).getTime()) / 1000 / 60 - 40 - 90) / 60
  const endTime = new Date(new Date(beginTime).getTime() + 60 * 6 * 1000)

  console.log('beginTime:', beginTime)
  console.log('currentTime:', stdTime)
  console.log('endTime', endTime)
  console.log('minus 12:00 - 13:30, 6:00 - 6:40')
  console.log('working hours:', hours)
}
export { computeWorkingTime, computeWorkingTimeDesc }
