type KV = { [key: string]: any }
type StorageType = 'boolean' | 'string' | 'number'
type StorageKey = `${StorageType}:${string}`

// 2023.2.23: phase2: use inital literal data
const STORAGE_KEY_LIST = ['string:content', 'boolean:isSaved'] as const

type ValueType<T extends StorageKey> = T extends `${infer r}:${string}`
  ? r extends 'boolean'
    ? boolean
    : r extends 'string'
      ? string
      : r extends 'number'
        ? number
        : never
  : never

const createStorageKit = <T extends readonly [...rest: any[]]>(keyList: T) => {
  const get = <
    Tunion extends (typeof keyList)[number],
    U extends ValueType<Tunion>,
  >(
    key: Tunion
  ): U | null => {
    const res = localStorage.getItem(key)
    if (res !== null) {
      return JSON.parse(res)
    } else {
      return null
    }
  }

  const set = <
    Tunion extends (typeof keyList)[number],
    U extends ValueType<Tunion>,
  >({
    key,
    value,
  }: {
    key: Tunion
    value: U
  }) => {
    const rKey = `${key}`
    localStorage.setItem(rKey, JSON.stringify(value))
  }

  return {
    get,
    set,
  }
}

const storageKit = createStorageKit(STORAGE_KEY_LIST)
const res = storageKit.get('string:content')
const res2 = storageKit.get('boolean:isSaved')
storageKit.set({ key: 'string:content', value: 'asdf' })
storageKit.set({ key: 'boolean:isSaved', value: true })

export { createStorageKit }
