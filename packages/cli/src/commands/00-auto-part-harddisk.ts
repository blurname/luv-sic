import { exec } from '@blurkit/core/src/core'
// use sudo to execute this script
const partMountDrive = async () => {
  const sdx = process.argv[2]
  // the new first partion number is 1
  const sdx1 = `${sdx}1`
  const mountPoint = '/mnt/data'
  const fstabPath = '/etc/fstab'
  await exec(`mkdir ${mountPoint}`)

  //await exec(`rm  -r ${mountPoint}`)
  await exec(`parted ${sdx} rm 1`)

  //await exec(`sudo parted ${sdx} mklabel gpt`)
  await exec(`parted ${sdx} -- mkpart primary ext4 1MiB 100%`)

  // 3. mkfs
  await exec(`mkfs.ext4 ${sdx1}`)

  await exec(`mount ${sdx1} ${mountPoint}`)
  await exec(`chmod 777 ${mountPoint}`)
  await exec(`ln -sfT ${mountPoint} ~/data`)

  // 4. append to fstab
  const { stdout: UUIDmessage } = await exec(`blkid ${sdx1}`)
  const UUID = UUIDmessage.split(' ')[1].split('=')[1].split('"')[1]
  const appendMessage = `\n# ${sdx1}\nUUID=${UUID} /home/mnt/data ext4 rw,relatime 0 2`
  await exec(`echo "${appendMessage}" >> ${fstabPath} `)
  console.log('done')
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
partMountDrive()
