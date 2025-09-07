const isChinese = (str: string) => {
  // https://stackoverflow.com/questions/21109011/javascript-unicode-string-chinese-character-but-no-punctuation/61151122#61151122
  return !!str.match(/\p{Script=Han}/u)
}
