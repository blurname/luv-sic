// https://en.wikipedia.org/wiki/ANSI_escape_code
const colorToken = {
  Red: '\x1b[31m',
  Green: '\x1b[32m',
  Reset: '\x1b[0m',
  Yellow: '\x1b[33m',
  Blue: '\x1b[34m',
} as const
type Color = keyof typeof colorToken
type ColorLog = {
  msg: string
  fg: Color
}

type AlphaChar =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
type NumberChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type SymbolChar = '_'
type ValidChar = AlphaChar | NumberChar  | SymbolChar
type ValidLogStr<T extends string> = T extends `${infer R}${infer tail}` 
  ? R extends ValidChar ? `${R}${ValidLogStr<tail>}` : never
  : T
 // type A = ValidLogStr<'asf_sadf'>
 // type B = ValidLogStr<'a+d'>


const colorLog = ({ msg, fg }: ColorLog) => {
  return `${colorToken['Reset']}${colorToken[fg]}${msg}${colorToken['Reset']}`
}
// LG: logKit isntance

const logValidated  = <T extends string>(logStr: ValidLogStr<T>) => {
  return console.log(logStr)
}
// TODO: bl: use AE to implement log

const createLogKit = () => {
  return {
    log: logValidated,
    warn: (msg: string)=> {
      console.log(colorLog({msg,fg: 'Yellow'}))
    },
    success: (msg: string)=> {
      console.log(colorLog({msg,fg: 'Green'}))
    }, 
    error: (msg: string)=> {
      console.log(colorLog({msg,fg: 'Red'}))
    } 
  }
}
const LG = createLogKit()
export { colorLog, LG }
