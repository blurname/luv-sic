type Person = {
  type: 'person'
  name: string
  gender: 'male' | 'female'
  age: number
}

type OpBase = {
  dKey: string
  counter: number
  clientId: number
}

type Info1<T> = Record<keyof T, Omit<OpBase,'dKey'>> 

type Container<T> = {
  key: string
  dataKV: T
  info1: Info1<T> 
}

type UpdateOp = {
  type: 'update'
  key: string
  value: string | number
} & OpBase

type CreateOp = {
  type: 'create'
  dataKV: Record<string, unknown>
} & OpBase

type DeleteOp = {
  type: 'delete'
} & OpBase

type Op = 
  | UpdateOp
  | CreateOp
  | DeleteOp

const createCRDTStore = <T extends Record<string, unknown>>() => {
  const _dataMap = new Map<string, Container<T>>() 

  const _create = (op: CreateOp): Container<T> => {
    const info1 = {} as Info1<T>
    for (const key of Object.keys(op.dataKV)) {
      info1[key as keyof T] = {counter: 0, clientId:op.clientId }
    }

    const res = {
      key: op.dKey || Date.now().toString(),
      dataKV: op.dataKV as T,
      info1
    }
    _dataMap.set(res.key, res)
    return res
  }

  const _update = (op: UpdateOp) => {
    const data = _dataMap.get(op.dKey)!
    const data1: Container<T> = {
      ...data,
      dataKV: {
        ...data.dataKV,
        [op.key]: op.value
      },
      info1: {
        ...data.info1,
        [op.key]: {counter: op.counter,clientId:op.clientId}
      }
    }
    _dataMap.set(data1.key, data1)
    return 
  }

  const applyOp = (op: Op) => {
    if(!_checkApply(op)) return
    if(op.type === 'update'){
      const data = _dataMap.get(op.dKey)!
      if(data.info1[op.key].counter > op.counter) return
        console.log('🟦[blue]->data.info1[op.key].clientId > op.clientId: ',data.info1[op.key].clientId,op.clientId, data.info1[op.key].clientId > op.clientId)
      if(data.info1[op.key].clientId > op.clientId) return
      _update(op)
    } else if(op.type === 'create'){
      if(_dataMap.get(op.dKey)) return
      _create(op)
    } else if(op.type === 'delete'){

    }
    return
  }

  const _checkApply = (op: Op) => {
    if(op.type === 'update'){
      const res = _dataMap.get(op.dKey)
      if(!res) {
        console.log('fail: no such key to update')
        return false
      } 
    }
    return true 
  }

  const getItem = (key: string) => {
    return _dataMap.get(key) 
  }

  return {
    applyOp,
    getItem
  }
}

const crdtStore = createCRDTStore<Person>()

const person1: Person = {type: 'person', name: 'zhangsan', gender: 'male', age: 24 }
const person1Key = 'a1' 

crdtStore.applyOp({type:'create', dKey: 'a1',dataKV: person1,counter: 0, clientId: 1})

console.log('🟦[blue]->person1C: ', crdtStore.getItem(person1Key))
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 2,counter: 120, clientId: 1})
console.log('🟦[blue]->person1C: ', crdtStore.getItem(person1Key))
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 4,counter: 119, clientId: 1})
console.log('🟦[blue]->person1C: ', crdtStore.getItem(person1Key))
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 8,counter: 121, clientId: 1})
console.log('🟦[blue]->person1C: ', crdtStore.getItem(person1Key))
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 42, counter: 122, clientId: 1})
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 43, counter: 122, clientId: 2})
crdtStore.applyOp({type:'update', dKey: 'a1',key: 'age',value: 44, counter: 122, clientId: 99})
console.log('🟦[blue]->person1C: ', crdtStore.getItem(person1Key))
