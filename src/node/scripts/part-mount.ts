import { exec } from 'child_process'
import { promisify } from 'util'
const pExec = promisify(exec)
const partMountDrive = async () => {
  const sdx = process.argv[2]
  const pathName = './part-mount-test'
  //await pExec(`rm ${pathName}`)
  await pExec(`rm ${pathName}`)
  await pExec(`touch ${pathName}`)
  //await pExec(`chmod g+w ${pathName}`)

  //await pExec(`parted ${sdx} -- mklabel gpt`)
  //await pExec(`parted ${sdx} -- mkpart primary primary 1MiB 100%`)

  const sdx1 = sdx + '1'
  const sda1 = '/dev/sda1'

  //await pExec(`mkfs.ext4 ${sdx1}`)
  //const {stdout: UUIDmessage} = await pExec(`blkid ${sdx}`)

  const { stdout: UUIDmessage } = await pExec(`blkid ${sda1}`)
  const UUID = UUIDmessage.split(' ')[1].split('=')[1].split("\"")[1]
  const appendMessage = `# ${sdx1}\nUUID=${UUID} /home/mb/data ext4 rw,relatime 0 2`
  await pExec(`echo "${appendMessage}" >> ${pathName} `)
  await pExec(`cat ${pathName}`)
  //await pExec(`rm ${pathName}`)

}

partMountDrive()

