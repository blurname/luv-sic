const colorToken = {
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Reset: '\x1b[0m',
  Yellow: '\x1b[33m',
} as const
type Color = keyof typeof colorToken
type ColorLog = {
  msg: string
  fg: Color
}
const colorLog = ({ msg, fg }: ColorLog) => {
  return `${colorToken['Reset']}${colorToken[fg]}${msg}${colorToken['Reset']}`
}
export { colorLog }
