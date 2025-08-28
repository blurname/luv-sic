const urlHash = 'dNBfvecMrnj08rJnFt68x'
const RANGE_LIST = [
  // 62
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]
const toggle20230321 = (curDate: Date) => {
  const rule = {
    '2023-03-23T10:00:00.080Z': RANGE_LIST.slice(0, 12),
    '2023-03-24T10:00:00.080Z': RANGE_LIST.slice(12, 24),
    '2023-03-25T10:00:00.080Z': RANGE_LIST.slice(24, 36),
    '2023-03-26T10:00:00.080Z': RANGE_LIST.slice(36, 48),
    '2023-03-27T10:00:00.080Z': RANGE_LIST.slice(48, 62)
  }

  const last = urlHash.split('').at(-1)
  let canToggle = false
  const curTime = curDate.getTime()
  let rangS = ''
  for (const [date, range] of Object.entries(rule)) {
    rangS += range
    if (curTime >= new Date(date).getTime()) {
      console.log(range)
      if (range.includes(last)) {
        canToggle = true
        break
      }
    }
  }
  console.log(rangS)
  return canToggle
}
toggle20230321(new Date())
export { toggle20230321 }
