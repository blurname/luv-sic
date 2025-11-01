import {} from 'node:test'
type KvMapFromScript = { [k: string]: string }

type ValueType<T> =
   T extends 'boolean' ? boolean
 : T extends 'string' ? string
 : T extends 'number' ? number
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

const parseArg = <const Args extends  Record<string,{desc: string, type: "string" | "boolean"}>>(argv: string[], argDesc: Args) => {
  const resParamKV = {} as any
  Object.keys(argDesc).forEach((k0) => {
    const paramKV = argv.find((arg) => arg.startsWith(k0))
    if(!paramKV) return
    const [k,v] = paramKV.split("=")
    const type = argDesc[k].type
    if(type === 'string'){
      resParamKV[k] = v
    } else if(type === 'boolean') { // 有 key 就代表一定是 true
      resParamKV[k] = true
    }else {
      resParamKV[k] = false
    }
  })
  return resParamKV as {[k in keyof Args]: ValueType<Args[k]['type']>}
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

export { parseOptionList, createCliStore, parseArg }
