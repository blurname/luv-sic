type KV = {[key:string]:any}
type StorageType = 'boolean' | 'string' | 'number'
type StorageKey = `${StorageType}:${string}`

// 2023.2.22: phase1: type safe api
const STORAGE_KEY_LIST = [
  { key: 'string:content' },
  { key: 'boolean:isSaved' },
  { key: 'boolean:isSaved' }
] as const
// const STORAGE_KEY_LIST = {
// 1:{key:'string:content'},
// 2:{key:'boolean:isSaved'},
// 3:{key:'boolean:isSaved'},
// } as const
// type t1 = typeof STORAGE_KEY_LIST
// STORAGE_KEY_LIST.push()
type ValueType<T extends StorageKey> =
  T extends `${infer r}:${string}` ? r extends 'boolean' ? boolean
: r extends 'string' ? string
: r extends 'number' ? number
: never
: never

const createStorageKit = () => {
  const get = <T extends StorageKey, U extends ValueType<T>>(key:T):U => {
    return JSON.parse(localStorage.getItem(key)!)
  }

  const set = <T extends StorageKey, U extends ValueType<T>>({ key, value }:{key:T, value:U}) => {
    const rKey = `${key}`
    localStorage.setItem(rKey, JSON.stringify(value))
  }

  return {
    get,
    set
  }
}

const storageKit = createStorageKit()

storageKit.set({ key: 'number:s', value: 123 })
storageKit.set({ key: 'boolean:s', value: true })
storageKit.get('boolean:s')

export {
  createStorageKit
}
