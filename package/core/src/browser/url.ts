
type Fn = ()=> string | object
const createUrlInit = <const T extends Record<string, Fn>> (config:T) => {
  // write to globalThis, know the number of url parameter used
  // @ts-ignore
  Object.assign(globalThis, { _urlp: { ...globalThis._urlp, ...config } })

  return (param?: keyof T & string) => {
    const params = new URLSearchParams(location.search)
    if (param === undefined) {
      for (const k of params.keys()) {
        if (typeof config[k] === 'function') { return config[k]() }
      }
      return
    }
    const v = params.get(param)
    if (v !== null) {
      return config[param]()
    }
  }
}
export { createUrlInit }
