type KV = {[key:string]:any}
type StorageType = 'boolean' | 'string' | 'number' 
type StorageKey = `${StorageType}:${string}`

// 2023.2.22: phase1: type safe api
const STORAGE_KEY_LIST= [
  'string:content',
  'boolean:isSaved',
] as const
type ValueType<T extends StorageKey> =
  T extends `${infer r}:${string}` ? r extends 'boolean' ? boolean
: r extends 'string' ? string
: r extends 'number' ? number
: never
: never

const createStorageKit = <T extends readonly [...rest:any[]]>(keyList:T) => {

  const get = <Tunion extends typeof keyList[number],U extends ValueType<Tunion>>(key:Tunion):U => {
    return JSON.parse(localStorage.getItem(key)!)
  }

  const set = <T extends StorageKey,U extends ValueType<T>>({key,value}:{key:T,value:U}) => {
    const rKey = `${key}`
    localStorage.setItem(rKey, JSON.stringify(value))
  }

  return {
    get,
    set
  }
}

const storageKit = createStorageKit(STORAGE_KEY_LIST)
const res = storageKit.get('string:content')

export {
  createStorageKit
}
