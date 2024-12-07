type GenQueryRes<T extends object> = {
  [key in keyof T as `get${Capitalize<key & string>}`]:(state:any)=>T[key]
}
const genQuery = <T extends object>(domainSate:T, { getStateFn }:{getStateFn:(state:any)=>any}):GenQueryRes<T> => {
  const query:any = {}
  for (const key of Object.keys(domainSate)) {
    const UpperKey = key.substring(0, 1).toUpperCase() + key.substring(1)
    query[`get${UpperKey}`] = (state:any) => getStateFn(state)[key]
  }
  return query
}

const genEntryKey = <T extends object>(entry:T):{[key in keyof T]:key} => {
  const entryKey:any = {}
  for (const key of Object.keys(entry)) {
    entryKey[key] = key
  }
  return entryKey
}

// 实现一个 ts 类型，接收泛型 T ，T 为任意字符串，返回 {[`${T}command`]: ()=>void} 为结果
type GenCommand<T> = {
  name: string
  impl: (store: {getState:()=> any, dispatch:any}, { type, payload }:{type: string, payload:T}) => void
}
const genCommand = <T>({ name, impl }: GenCommand<T>) => {
  return {
    _entryFn: {
      [name]: (store, action) => {
        return impl(store, action)
      }
    },
    command: (payload: Parameters<typeof impl>[1]['payload']) => {
      return { type: name, payload }
    }
  }
}

type AsfdProps = {
  aaa: string
  bbb: number
}

const testF = genCommand<AsfdProps>({
  name: 'testF',
  impl: ({ getState, dispatch }, { payload: { aaa, bbb } }) => {
    console.log('asf')
  }
})

type CommandType<T extends string> = {
    [K in `${T}command`]: () => void;
};

function createCommandObject<T extends string> (commandName: T): CommandType<T> {
  return {
    [commandName + 'command']: () => {
      console.log(`执行 ${commandName}command 对应的函数逻辑`)
    }
  } as CommandType<T>
}

const myCommand = createCommandObject('my')
myCommand.mycommand()

const anotherCommand = createCommandObject('other')
anotherCommand.othercommand()

// testF._entryFn
const dispatch = ({ type, payload }) => {
  // do nothing
}

dispatch(testF.command({ aaa: 'asdf', bbb: 23 }))

const DomainUtil = {
  genEntryKey,
  genQuery
}
export {
  DomainUtil
}
