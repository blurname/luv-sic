export class createObjectDeepUpdate {
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
          ...recUpdate(currentObj[v[depth]], depth + 1),
        },
      }
    }
    return recUpdate(obj, 0)
  }
}
