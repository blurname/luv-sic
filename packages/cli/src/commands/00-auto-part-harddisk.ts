import { execSync } from 'node:child_process'

// use sudo to execute this script
const partMountDrive = async () => {
  const sdx = process.argv[2]
  // the new first partion number is 1
  const sdx1 = `${sdx}1`
  const mountPoint = '/mnt/data'
  const fstabPath = '/etc/fstab'
  execSync(`mkdir ${mountPoint}`)

  // execSync(`rm  -r ${mountPoint}`)
  execSync(`parted ${sdx} rm 1`)

  // execSync(`sudo parted ${sdx} mklabel gpt`)
  execSync(`parted ${sdx} -- mkpart primary ext4 1MiB 100%`)

  // 3. mkfs
  execSync(`mkfs.ext4 ${sdx1}`)

  execSync(`mount ${sdx1} ${mountPoint}`)
  execSync(`chmod 777 ${mountPoint}`)
  execSync(`ln -sfT ${mountPoint} ~/data`)

  // 4. append to fstab
  const UUIDmessage = execSync(`blkid ${sdx1}`).toString()
  const UUID = UUIDmessage.split(' ')[1].split('=')[1].split('"')[1]
  const appendMessage = `\n# ${sdx1}\nUUID=${UUID} /home/mnt/data ext4 rw,relatime 0 2`
  execSync(`echo "${appendMessage}" >> ${fstabPath} `)
  console.log('done')
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
partMountDrive()
