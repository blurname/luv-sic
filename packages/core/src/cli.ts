type KvMapFromScript = { [k: string]: string }

const reduceDash = <T extends string | string>(strHasDash: T) => {
  return strHasDash.split('-').at(-1)
}

const parseOptionList = (argv: string[], kvMapFromScript: KvMapFromScript) => {
  const parsedOptionList: KvMapFromScript = {}
  Object.keys(kvMapFromScript).forEach((k) => {
    const paramK = argv.findIndex((arg) => {
      return reduceDash(arg) === k
    })
    if (paramK !== -1) {
      const paramV = argv[paramK + 1]
      parsedOptionList[k] = paramV as string
    }
  })
  return { ...kvMapFromScript, ...parsedOptionList }
}
// export { parseOptionList }
//
// const main = () => {
// const result = parseOptionList(process.argv, options)
// console.log(result)
// }
// main()

export { parseOptionList }
