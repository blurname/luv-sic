// https://en.wikipedia.org/wiki/ANSI_escape_code
const colorToken = {
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Reset: '\x1b[0m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m'
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
