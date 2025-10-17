import {} from 'node:test'
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

const parseOptionList2 = <const Args extends {[k: string]:{desc: string,type: "string" | "boolean"}}>(argv: string[], kvMapFromScript: Args) => {
  const resParamKV = {} as {[k in keyof Args]: string}
  Object.keys(kvMapFromScript).forEach((k) => {
    const paramKV = argv.find((arg) => arg.startsWith(k))
    if(!paramKV) return
    const [key,value] = paramKV.split("=") as [key: keyof Args, value: string]
    if(value){
      resParamKV[key]= value
    }else {
      resParamKV[key] = ''
    }
  })
  return resParamKV 
}
// 放到 cliKit 里面
// 取 参数时，不存在，扔出去就行

const res = parseOptionList2(
  process.argv
,{
  "--a": {desc:"desc-a", type: "boolean"},
  "--b": {desc:"desc-b", type: "boolean"}
})

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
