type TreKey = string
type ItemBase = {key: TreKey, type: unknown, sup: string, sub: string[] }

const B_SEED = 'seed'
const B_ROOT = 'root'

const createTreStore = <TreItem extends ItemBase>() => {
  const _itemMap = new Map<TreKey, TreItem>()
  const subscribeMap = new Map<TreKey, TreKey[]>()
  const eventItemKeyCount = new Map<TreKey, number>()
  // @ts-ignore
  _itemMap.set(B_ROOT, { key: B_ROOT, sup: B_SEED, sub: [] })

  const getItem = <Type extends TreItem['type']>(key: string | undefined) => {
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

  const subscribeItem = ({ key, subscribeKey }: {key: TreKey, subscribeKey: TreKey}) => {
    let value = subscribeMap.get(key)
    if (!value) subscribeMap.set(key, (value = []))
    if (value.includes(subscribeKey)) return
    value.push(subscribeKey)
  }
  // TODO: bl: 
  // a1 = 1
  // b1 = a1 + 2
  // c1 = b1 + 3
  // Q1: dep a1 -> b1 -> c1, update a1,
  // update(a1 = 4), update(b1 = a1 + 5),
  // get update Notify only once
  // a1 -> b1 -> c1
  // b1 -> c1
  // A1-1: 粗粒度，直接全局计数，状态更新
  // 

  const _subscribeSend = (key: TreKey) => {
    const listner = subscribeMap.get(key)
    if (!listner) return
    for (const k of listner) {
      eventItemKeyCount.
    }
  }

  return {
    _itemMap,
    query: {
      getItem
    },
    command: {
      updateItem,
      createItem,
      replaceItem,
      deleteItem,
      subscribeItem
    }
  }
}

// type NodeItem = {
//   type: 'node'
//   nodeName: string
// } & ItemBase
//
// type BranchItem = {
//   type: 'branch'
//   branchName: string
// } & ItemBase
//
// type RootItem = {
//   type: 'root'
//   rootName: string
// } & ItemBase
// type TreItem = RootItem | NodeItem | BranchItem

// const treStore = createTreStore<TreItem>()
// const a = treStore.query.getItem<'node' | 'branch'>('asf')
// const b = treStore.query.getItem<'root'>('asf')?.rootName
export type {
  ItemBase
}
export {
  createTreStore, B_ROOT
}
