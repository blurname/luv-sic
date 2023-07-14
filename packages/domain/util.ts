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

const DomainUtil = {
  genEntryKey,
  genQuery
}

type Primitive = string | boolean | number
type LiteralObj = {[k: string ]:Primitive | LiteralObj}

type QueryParams<Name extends string> = {
  getStateFn:(state:any)=> Name
}

type Action<Name extends string, Payload extends LiteralObj> = {
  type: `${Name}:update` | `${Name}:clear` | `${Name}:${string}`
  payload: Payload
}

type __Reducer<Name extends string, State extends LiteralObj> = (state:State, action:Action<Name, State>)=> State

type CreateDomainProps<Name extends string, State extends LiteralObj> = {
  name: Name
  __initalState: State
  __reducer: __Reducer<Name, State>
  queryParams: QueryParams<string>
}

type CreateDomainResult<Name extends string, State extends LiteralObj > = {
  name: Name
  __initalState: State
   __reducer: __Reducer<Name, State>
  // __entry: ()=>any
  query: ReturnType<typeof genQuery<State>>
  // entryKey: ReturnType<typeof genEntryKey<T>>

}

const createDomain = <Name extends string, State extends LiteralObj > ({
  name,
  __initalState,
  __reducer,
  queryParams
}:CreateDomainProps<Name, State>):CreateDomainResult<Name, State> => {
  return {
    name,
    __initalState,
    __reducer,
    query: genQuery(__initalState, queryParams)
  }
}

const abc = createDomain({
  name: 'test',
  __initalState: {
    editingPos: {
      x: -1,
      y: -1
    },
    isShallowEditing: false, // 浅编辑，可以通过上下左右移动，editingPos
    isDeepEditing: false // 深编辑，同文本编辑
  },
  __reducer: (state, action) => {
    const { payload, type } = action
    return state
  },

  queryParams: {
    getStateFn: (state) => {
      return state.aa
    }
  }
})
const a = abc

export {
  DomainUtil
}
