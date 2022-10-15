const deepObject = {
  a: 1,
  b: {
    bb1: 2,
    bb2: 3,
  },
  c: {
    cc: {
      ccc: 4,
    },
  },
} as const

const deepObject1 = {
  a: 1,
  b: {
    bb1: 2,
    bb2: 3,
  },
  c: {
    ccc: 5,
  },
} as const

let keyValue
let keyPath = ''
const keyTarget = 'ccc'
const pathMap = new Map<string, string[]>()

// 找 -> 存在( 记录 path) -> deepClone, 根据 path udpate
// path: [`key1:key11:key111`]
// path: key: [path1, path2], 判断 path
const findObjectPathByTargetKey = (obj, key, path) => {
  Object.entries(obj).forEach(([k, v]) => {
    if (k === key) {
      keyValue = obj[k]
      keyPath = `${path}:${k}`
    } else {
      if (typeof obj[k] === 'object') {
        findObjectPathByTargetKey(obj[k], key, `${path === '' ? '' : `${path}:`}${k}`)
      }
    }
  })
}
const deepObjects = [deepObject, deepObject1]

const generatePathMap = (deepObjects: any[]) => {
  deepObjects.forEach((obj) => {
    findObjectPathByTargetKey(obj, keyTarget, '')
    const v = pathMap.get(keyTarget)
    if (v === undefined) {
      pathMap.set(keyTarget, [keyPath])
    } else {
      pathMap.set(keyTarget, [...v, keyPath])
    }
  })
}

generatePathMap(deepObjects)

const detectWhichPath = (obj, key): string => {
  let finalPath: string
  const v = pathMap.get(key)
  v?.map((s) => {
    const ss = s.split(':')
    let current = obj[ss[0]]
    if (current !== undefined) {
      for (let i = 1; i < ss.length; i++) {
        current = current[ss[i]]
        if (current === undefined) break
      }
      if (current !== undefined) finalPath = s
    }
  })
  //console.log(k, v)
  return finalPath
}

//const deepObjectUpdate = (obj, path, value) => {
//const ss = path.split(':')
//let current = obj[ss[0]]
//if (current !== undefined) {
//for (let i = 1; i < ss.length; i++) {
//current = current[ss[i]]
//}
//}
//}
//
//
const deepObjectUpdate2 = (obj, targetKey, value, path) => {
  const v = path.split(':')
  const recUpdate = (currentObj, depth) => {
    if (v[depth] === targetKey) {
      return { ...currentObj, [targetKey]: value }
    }
    return {
      ...currentObj,
      [v[depth]]: {
        ...recUpdate(obj[v[depth]], depth + 1),
      },
    }
  }
  const updated = recUpdate(obj, 0)
  console.log(updated)
}
console.log(detectWhichPath(deepObject, 'ccc'))
const finalPath = detectWhichPath(deepObject, 'ccc')
console.log(finalPath)
deepObjectUpdate2(deepObject, 'ccc', 'kk', finalPath)
console.log(deepObject)

//const cc = deepObject.c.cc.ccc
////let ccc = cc.ccc
////
//deepObject.c.cc.ccc = 1

//ccc = 1
//console.log(deepObject)
