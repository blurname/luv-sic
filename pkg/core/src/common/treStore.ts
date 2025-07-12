type TreKey = string
type ItemBase = {key: TreKey, type: unknown, sup: string, sub: string[] }

// const B_SEED = 'seed'
// const B_ROOT = 'root'

const createTreStore = <TreItem extends ItemBase>() => {
  const _itemMap = new Map<TreKey, TreItem>()
  // _itemMap.set(B_ROOT, { key: B_ROOT, sup: B_SEED, sub: [] })

  const getItem = <Type extends TreItem['type']>(key: string | undefined) => {
    if (key === undefined) return undefined
    return _itemMap.get(key) as TreItem & {type: Type} | undefined
  }
  const getItem2 = <Type extends 'a' | 'b'>(key: string | undefined) => {
    if (key === undefined) return undefined
    return _itemMap.get(key) as TreItem & {type: Type} | undefined
  }

  const updateItem = <U extends (Partial<TreItem> & {key: string})>(item: U) => {
    const item0 = getItem(item.key) as TreItem
    if (!item0) return
    return _itemMap.set(item.key, { ...item0, ...item })
  }

  const replaceItem = (oldItemCid: string, newItem: TreItem) => {
    const item0 = getItem(oldItemCid)
    if (!item0) return
    const item0Sup = getItem(item0.sup)
    if (!item0Sup) return
    _itemMap.delete(item0.key)
    _itemMap.set(item0Sup.key, { ...item0Sup, sub: [...item0Sup.sub.filter(i => i !== item0.key), newItem.key] })
    _itemMap.set(newItem.key, newItem)
  }

  const createItem = (item: TreItem) => {
    const item0 = getItem(item.key)
    if (item0) return
    const item0Sup = getItem(item.sup)
    if (!item0Sup) return
    _itemMap.set(item0Sup.key, { ...item0Sup, sub: [...item0Sup.sub, item.key] })
    _itemMap.set(item.key, item)
  }

  const deleteItem = (itemCid: TreItem['key']) => {
    const item0 = _itemMap.get(itemCid)
    if (!item0) return
    _itemMap.delete(itemCid)
    const item0Sup = _itemMap.get(item0.sup)
    if (!item0Sup) return
    _itemMap.set(item0Sup.key, { ...item0Sup, sub: item0Sup.sub.filter(i => i !== itemCid) })
  }

  return {
    _itemMap,
    query: {
      getItem, getItem2
    },
    command: {
      updateItem,
      createItem,
      replaceItem,
      deleteItem
    }
  }
}

type NodeItem = {
  type: 'node'
  nodeName: string
} & ItemBase

type BranchItem = {
  type: 'branch'
  branchName: string
} & ItemBase

type RootItem = {
  type: 'root'
  rootName: string
} & ItemBase
type TreItem = RootItem | NodeItem | BranchItem

const treStore = createTreStore<TreItem>()
const a = treStore.query.getItem<'node' | 'branch'>('asf')
const b = treStore.query.getItem<'root'>('asf')?.rootName
