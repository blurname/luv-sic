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

type __Entry = {
  [k:string]: ({ getState, dispatch }:{ getState:(state:any) => any, dispatch:({ type, payload }:{type:string, payload:any}) => void}, { ...args }:any) => void
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
  __entry: __Entry
  queryParams: QueryParams<string>
}

type CreateDomainResult<Name extends string, State extends LiteralObj, Entry extends __Entry> = {
  name: Name
  __initalState: State
  __reducer: __Reducer<Name, State>
  __entry: Entry
  query: ReturnType<typeof genQuery<State>>
  entryKey: ReturnType<typeof genEntryKey<Entry>>
}

const createDomain = <Name extends string, State extends LiteralObj > ({
  name,
  __initalState,
  __reducer,
  __entry,
  queryParams
}:CreateDomainProps<Name, State>):CreateDomainResult<Name, State, typeof __entry> => {
  return {
    name,
    __initalState,
    __reducer,
    __entry,
    query: genQuery(__initalState, queryParams),
    entryKey: genEntryKey(__entry)
  }
}

const abc = createDomain({
  name: 'test',
  __initalState: {
    editingPos: {
      x: -1,
      y: -1
    },
    isShallowEditing: false,
    isDeepEditing: false
  },
  __reducer: (state, action) => {
    const { payload, type } = action
    return state
  },
  __entry: {
    'asdf': ({ getState, dispatch }, { sdf }) => {
      console.log('a')
    }
  },
  queryParams: {
    getStateFn: (state) => {
      return state.aa
    }
  }
})
const a = abc.__entry
const b = abc.entryKey

export {
  DomainUtil
}
