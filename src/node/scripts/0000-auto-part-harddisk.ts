import { exec } from '../core'
const partMountDrive = async () => {
  const sdx = process.argv[2]
  // the new first partion number is 1
  const sdx1 = sdx + '1'
  const mountPoint = '~/data'
  const fstabPath = '/etc/fstab'
  // await pExec(`umount ${sdx1}`)
  await exec(`rm  -r ${mountPoint}`)
  await exec(`parted ${sdx} rm 1`)
  await exec(`mkdir ${mountPoint}`)

  //await pExec(`sudo parted ${sdx} mklabel gpt`)
  await exec(`parted ${sdx} -- mkpart primary ext4 1MiB 100%`)

  // 3. mkfs
  await exec(`mkfs.ext4 ${sdx1}`)

  // await pExec(`mount ${sdx1} ${mountPoint}`)

  // 4. append to fstab
  const { stdout: UUIDmessage } = await exec(`blkid ${sdx1}`)
  const UUID = UUIDmessage.split(' ')[1].split('=')[1].split("\"")[1]
  const appendMessage = `\n# ${sdx1}\nUUID=${UUID} /home/mb/data ext4 rw,relatime 0 2`
  await exec(`echo "${appendMessage}" >> ${fstabPath} `)

}

partMountDrive()

