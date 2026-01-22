export type KvMapFromScript = { [k: string]: string }

const reduceDash = (strHasDash: string) => strHasDash.split('-').at(-1)

export const parseOptionList = (argv: string[], kvMapFromScript: KvMapFromScript) => {
  const parsedOptionList: KvMapFromScript = {}
  Object.keys(kvMapFromScript).forEach((k) => {
    const paramK = argv.findIndex((arg) => reduceDash(arg) === k)
    if (paramK !== -1) {
      parsedOptionList[k] = (argv[paramK + 1] || true) as string
    }
  })
  return { ...kvMapFromScript, ...parsedOptionList }
}

type ValueType<T> = T extends 'boolean' ? boolean : T extends 'string' ? string : T extends 'number' ? number : T extends readonly unknown[] ? T[number] : T
type Arg = Record<string, { type: 'string' | 'boolean' | 'number' | 'or'; value?: unknown[]; desc?: string }>

export const parseArg = <const ArgT extends Arg, Res extends { [k in keyof ArgT]: any }>(argv: string[], argDesc: ArgT) => {
  const resParamKV = {} as any
  for (const k0 of Object.keys(argDesc)) {
    const paramKV = argv.find((arg) => arg.startsWith(k0))
    if (!paramKV) continue
    const [k, v] = paramKV.split("=")
    const type = argDesc[k].type
    if (type === 'string' || type === 'or') {
      resParamKV[k] = v
    } else if (type === 'number') {
      resParamKV[k] = Number(v)
    } else if (type === 'boolean') {
      resParamKV[k] = true
    }
  }
  return resParamKV as Res
}

export const createCliStoreEff = <const ArgT extends Arg>({ arg }: { arg: ArgT }) => {
  const argList = process.argv
  const callPath = argList[1]
  const _arg = parseArg(argList, arg)
  const getArg = (key: keyof ArgT) => _arg[key]
  const getArgDefault = (key: keyof ArgT, defaultValue: any) => _arg[key] || defaultValue
  return { callPath, getArg, getArgDefault }
}

export const getCallPath = () => process.cwd()
