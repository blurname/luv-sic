import { exec } from 'node:child_process'
import { promisify } from 'util'
const pExec = promisify(exec)
const part = async () => {
  await pExec('parted /dev/nvme0n1 -- mklabel gpt')
  await pExec('parted /dev/nvme0n1 -- mkpart primary 512MiB 100%')
  await pExec('parted /dev/nvme0n1 -- mkpart ESP fat32 1MiB 512MiB')
  await pExec('parted /dev/nvme0n1 -- set 2 esp on')
  await pExec('mkfs.ext4 -L nixos /dev/nvme0n1p1')
  await pExec('mkfs.fat -F 32 -n boot /dev/nvme0n1p2')
  await pExec('mount /dev/disk/by-label/nixos /mnt')
  await pExec('mount /dev/disk/by-label/boot /mnt/boot')
  await pExec('nixos-generate-config --root /mnt')
}
const df = async () => {
  await pExec('git clone https://github.com/blurname/df.git')
  await pExec('mv -f .df/1-nixos/Mconfiguration.nix /mnt/nixos/configuration.nix')
}

const main = async () => {
  const [, , func] = process.argv
  if (func === 'part') {
    await part()
  } else if (func === 'df') {
    await df()
  }
}
main()
