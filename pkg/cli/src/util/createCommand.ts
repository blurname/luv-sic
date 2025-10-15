const createCommand = <const Desc, T>({
  desc,
  command,
}: {
  desc: Desc
  command: T
}) => {
  return {
    command,
    desc,
  }
}
export { createCommand }
