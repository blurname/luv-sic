import { exec } from '../core'
const calcWorkingTime = async () => {
  const { stdout: time } = await exec('timedatectl status')
  const local = time.split('\n')[0]
  const dateIndex = local.indexOf(':')
  const stdTime = local.slice(dateIndex + 1).trim()
  const month = stdTime.split(' ')[1]
  const beginTime = `${month} 09:00:00 CST`
  const hours = ((new Date(stdTime).getTime() - new Date(beginTime).getTime()) / 1000 / 60 - 90 - 40) / 60
  console.log('working hours:', hours)
}
export { calcWorkingTime }
