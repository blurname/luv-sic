type StorageType = 'boolean' | 'string' | 'number'
type StorageKey = `${StorageType}:${string}`

// 2023.2.23: phase3: better ts way

type MBStorage =
  | 'string:content'
  | 'boolean:isSaved'

type ValueType<T extends StorageKey> =
    T extends `${infer r}:${string}` ? r extends 'boolean' ? boolean
  : r extends 'string' ? string
  : r extends 'number' ? number
  : never
  : never

const createStorageKit = <T extends StorageKey>() => {
  const get = <TT extends T, U extends ValueType<TT>>(key:TT):U | null => {
    const res = localStorage.getItem(key)
    if (res !== null) {
      return JSON.parse(res)
    } else {
      return null
    }
  }

  const set = <TT extends T, U extends ValueType<TT>>({ key, value }:{key:TT, value:U}) => {
    const rKey = `${key}`
    localStorage.setItem(rKey, JSON.stringify(value))
  }

  return {
    get,
    set
  }
}

const storageKit = createStorageKit<MBStorage>()
const res = storageKit.get('string:content')
const res2 = storageKit.get('boolean:isSaved')
storageKit.set({ key: 'string:content', value: 'asdf' })
storageKit.set({ key: 'boolean:isSaved', value: true })

export {
  createStorageKit
}
