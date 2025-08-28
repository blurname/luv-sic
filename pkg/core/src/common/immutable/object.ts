// 找 -> 存在( 记录 path) -> 根据 path udpate
// path: [`key1:key11:key111`]
// path: key: [path1, path2], 判断 path

// FIXME: class 没有显示声明的 variable, lint 不会报错

// feature:
// 1. update 统一的 key
// 2. 做了缓存，应该会快
//
// TODO:
// 1. ditch keyPath
// 2. naming function/variable better
// 3. more test case
class createObjectDeepUpdate {
  private pathMap = new Map<string, string[]>()
  private keyPath = ''

  private findObjectPathByTargetKey = (obj: any, key: string, path: string) => {
    Object.entries(obj).forEach(([k, v]) => {
      if (k === key) {
        this.keyPath = `${path}:${k}`
      } else {
        if (typeof obj[k] === 'object') {
          this.findObjectPathByTargetKey(
            obj[k],
            key,
            `${path === '' ? '' : `${path}:`}${k}`
          )
        }
      }
    })
  }

  private detectWhichPath = (obj: any, key: string): string => {
    let finalPath = ''
    const v = this.pathMap.get(key)
    v?.forEach((s) => {
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
    return finalPath
  }

  generatePathMap = (objs: any[], keyTarget: string) => {
    objs.forEach((obj) => {
      if (obj[keyTarget] !== undefined) this.keyPath = keyTarget
      else this.findObjectPathByTargetKey(obj, keyTarget, '')
      const v = this.pathMap.get(keyTarget)
      if (v === undefined) {
        this.pathMap.set(keyTarget, [this.keyPath])
      } else {
        this.pathMap.set(keyTarget, [...v, this.keyPath])
      }
    })
  }

  deepUpdate = (obj: any, key: string, value: any) => {
    const path = this.detectWhichPath(obj, key)
    const v = path.split(':')
    const recUpdate = (currentObj: any, depth: number): any => {
      if (v[depth] === key) {
        return { ...currentObj, [key]: value }
      }
      return {
        ...currentObj,
        [v[depth]]: {
          ...recUpdate(currentObj[v[depth]], depth + 1)
        }
      }
    }
    const updated = recUpdate(obj, 0)
    return updated
  }
}
export { createObjectDeepUpdate }

// const deepObject = {
// a: 1,
// b: {
// bb1: 2,
// bb2: 3
// },
// c: {
// cc: {
// ccc: 4
// }
// }
// } as const

// const deepObject1 = {
// a: 1,
// b: {
// bb1: 2,
// bb2: 3
// },
// c: {
// ccc: 5
// }
// } as const

// const objectDeepUpdate = new createObjectDeepUpdate()

// test1
// const deepObjects = [deepObject]

// objectDeepUpdate.generatePathMap(deepObjects, 'ccc')

// const res = objectDeepUpdate.deepUpdate(deepObject, 'ccc', { a: 666 })

// test2
// const deepObjects = [deepObject2]

// objectDeepUpdate.generatePathMap(deepObjects, 'fill')

// const res = objectDeepUpdate.deepUpdate(deepObject2, 'fill', { a: 666 })
// console.log(res)
