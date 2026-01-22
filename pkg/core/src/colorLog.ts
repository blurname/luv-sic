// --- From colorLog.ts ---
const colorToken = {
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Reset: '\x1b[0m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
} as const

type Color = keyof typeof colorToken
type ColorLog = { msg: string; fg: Color }

export const colorLog = ({ msg, fg }: ColorLog) => {
  return `${colorToken['Reset']}${colorToken[fg]}${msg}${colorToken['Reset']}`
}

export const LG = {
  log: (msg: string) => console.log(msg),
  warn: (msg: string) => console.log(colorLog({ msg, fg: 'Yellow' })),
  success: (msg: string) => console.log(colorLog({ msg, fg: 'Green' })),
  error: (msg: string) => console.log(colorLog({ msg, fg: 'Red' }))
}
