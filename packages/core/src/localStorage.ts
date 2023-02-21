type LocalStorageKV = {
  [name:string]:string
}
const localStorageKit = <T extends LocalStorageKV>(KV:T) => {

  const get = (key:unknown) => {
    return localStorage.getItem(key)
  }

  const set = (key:unknown,value:unknown) => {
    localStorage.setItem(key, value)
  }

  return {
    get,
    set
  }
}
export {
  localStorageKit
}
