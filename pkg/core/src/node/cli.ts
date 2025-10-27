import {} from 'node:test'
type KvMapFromScript = { [k: string]: string }

type ValueType<T> =
   T extends 'boolean'
    ? boolean
    : T extends 'string'
      ? string
      : T extends 'number'
        ? number
        : never

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
      const paramV = argv[paramK + 1] || true
      parsedOptionList[k] = paramV as string
    }
  })
  return { ...kvMapFromScript, ...parsedOptionList }
}

// commandline param 
// 1. kv --k=v
// 2. key --k=true
// 2. optional --k

const parseOptionList2 = <const Args extends {[k: string]:{desc: string, type: "string" | "boolean"}}, U extends ValueType<Args[keyof Args]['type']>>(argv: string[], kvMapFromScript: Args) => {
  const resParamKV = {} as {[k in keyof Args]: U}
  Object.keys(kvMapFromScript).forEach((k) => {
    const paramKV = argv.find((arg) => arg.startsWith(k))
    if(!paramKV) return
    const [key,value] = paramKV.split("=") as [key: keyof Args, value: U]
    if(value){
      resParamKV[key]= value
    }else {
      // @ts-ignore
      resParamKV[key] = false
    }
  })
  return resParamKV 
}
// 放到 cliKit 里面
// 取 参数时，不存在，扔出去就行
const createCliStore = () => {
  const argList = process.argv
  const callPath = argList[1] 
  return  {
    callPath
  }
}

// export { parseOptionList }
//
// const main = () => {
// const result = parseOptionList(process.argv, options)
// console.log(result)
// }
// main()

export { parseOptionList, createCliStore, parseOptionList2 }
