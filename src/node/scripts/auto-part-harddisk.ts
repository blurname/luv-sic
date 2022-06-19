import { exec } from 'node:child_process'
import { promisify } from 'util'
const pExec = promisify(exec)
const partMountDrive = async () => {
  const sdx = process.argv[2]
  // the new first partion number is 1
  const sdx1 = sdx + '1'
  const mountPoint = '~/data'
  const fstabPath = '/etc/fstab'
  // await pExec(`umount ${sdx1}`)
  await pExec(`rm  -r ${mountPoint}`)
  await pExec(`parted ${sdx} rm 1`)
  await pExec(`mkdir ${mountPoint}`)

  //await pExec(`sudo parted ${sdx} mklabel gpt`)
  await pExec(`parted ${sdx} -- mkpart primary ext4 1MiB 100%`)

  // 3. mkfs
  await pExec(`mkfs.ext4 ${sdx1}`)

  // await pExec(`mount ${sdx1} ${mountPoint}`)

  // 4. append to fstab
  const { stdout: UUIDmessage } = await pExec(`blkid ${sdx1}`)
  const UUID = UUIDmessage.split(' ')[1].split('=')[1].split("\"")[1]
  const appendMessage = `\n# ${sdx1}\nUUID=${UUID} /home/mb/data ext4 rw,relatime 0 2`
  await pExec(`echo "${appendMessage}" >> ${fstabPath} `)

}

partMountDrive()

