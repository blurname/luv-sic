import { readFile, writeFile } from 'node:fs/promises'
const underScore2CamelCase = async () => {
  const filePath = process.argv[2]
  const jsonContent = await readFile(filePath)
  const rowList = jsonContent.toString().split('\n')
  const newRowList = []
  for (const row of rowList) {
    const ss = row.split(':')
    if (ss.length !== 2) {
      newRowList.push(row) // 这行不是 kv
      continue
    }
    const k = ss[0]
    const uK = k.split('_')
    if (uK.length < 2) {
      newRowList.push(row) // k 没有 underScore
      continue
    }
    const ckList = []
    for (const [index, s] of uK.entries()) {
      // k 转首字母
      if (index === 0) {
        ckList.push(s)
      } else {
        ckList.push(wordInitals2Upper(s))
      }
    }
    ss[0] = ckList.join('')
    newRowList.push(ss.join(':'))
  }
  const fileDirList = filePath.split('/')
  const fileName = fileDirList.at(-1)
  fileDirList[fileDirList.length - 1] = ''
  const fileDir = fileDirList.join('/')
  await writeFile(`${fileDir}/${fileName}toCamelCase.json`, newRowList.join('\n'))
}
const wordInitals2Upper = (s: string) => {
  const cs = s.split('')
  const Iw = []
  for (const [index, s] of cs.entries()) {
    if (index === 0) {
      Iw.push(s.toUpperCase())
    } else {
      Iw.push(s)
    }
  }
  return Iw.join('')
}
underScore2CamelCase()
