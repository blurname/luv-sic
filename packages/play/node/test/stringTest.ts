const testSubstring = () => {
  const str1 = 'abc copy b'
  const pos = str1.indexOf('copy')
  const str2 = str1.substring(0, pos)
  console.log(str2)
}

const colonSeparated2Camel = (ss:string) => {
  return ss.split(':').map((s) => s.substring(0, 1).toUpperCase() + s.substring(1)).join('')
}
console.log(colonSeparated2Camel('entry:draft:linkToastShow:update'))
export {

}
