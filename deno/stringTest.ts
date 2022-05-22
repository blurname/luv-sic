const testSubstring = () => {
  const str1 = "abc copy b"
  const pos = str1.indexOf('copy')
  const str2 = str1.substring(0, pos)
  console.log(str2)
}
