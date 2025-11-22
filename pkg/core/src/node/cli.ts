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

type ValueType<T> =
   T extends 'boolean' ? boolean
 : T extends 'string' ? string
 : T extends 'number' ? number
 : T extends readonly unknown[] ? T[number]
 : T

type Arg = Record<string,{desc?: string, type: {} }>
const parseArg = <const ArgT extends Arg, Res extends {[k in keyof ArgT]: ValueType<ArgT[k]['type']>}>(argv: string[], argDesc: ArgT) => {
  const resParamKV = {} as any
  for (const k0 of Object.keys(argDesc) ) {
    const paramKV = argv.find((arg) => arg.startsWith(k0))
    if(!paramKV) return resParamKV as Res 
    const [k,v] = paramKV.split("=")
    const type = argDesc[k].type
    if(type === 'string' || Array.isArray(type)){
      resParamKV[k] = v
    } else if(type === 'number'){
      resParamKV[k] = Number(v)
    } else if(type === 'boolean') { // 有 key 就代表一定是 true
      resParamKV[k] = true
    } else {
      resParamKV[k] = false
    }
    
  }
  return resParamKV as Res
}

// 放到 cliKit 里面
const createCliStoreEff = <const ArgT extends Arg>({arg}: {arg:ArgT}) => {
// 取 参数时，不存在，扔出去就行
  const argList = process.argv
  const callPath = argList[1] 
  const _arg = parseArg(argList,arg)! 

  type Value<B extends keyof ArgT> = ValueType<ArgT[B]['type']>

  const getArg = <U extends keyof ArgT> (key: U): Value<U> => _arg[key]
  const getArgDefault = <U extends keyof ArgT> (key: U, defaultValue: Value<U>): Value<U> => _arg[key] || defaultValue

  return  {
    callPath,
    getArg, getArgDefault
  }
}

const getCallPath = () => {
  return process.cwd()
}

// export { parseOptionList }
//
// const main = () => {
// const result = parseOptionList(process.argv, options)
// console.log(result)
// }
// main()

export { parseOptionList, createCliStoreEff, parseArg, getCallPath }
