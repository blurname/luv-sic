export const isChinese = (str: string) => {
  return !!str.match(/\p{Script=Han}/u)
}
