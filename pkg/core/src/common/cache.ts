const createFetchOnce = () => {
  const URL_PROMSIE_CACHE_MAP = new Map<string, Promise<unknown>>()
  const requestOnceAsync = async (url: string, cb?:(requsetResult: unknown)=>void) => {
    let res = URL_PROMSIE_CACHE_MAP.get(url)
    if (!res) {
      URL_PROMSIE_CACHE_MAP.set(url, (res = new Promise((resolve, reject) => {
        fetch(url).then(async (data) => {
          cb?.(await data.text())
          resolve(data)
        })
      })))
    }
    return res
  }
  return {
    requestOnceAsync
  }
}

// const { requestOnceAsync } = createFetchOnce()
// requestOnceAsync('http://127.0.0.1:3000', (data) => { console.log(data) })
// requestOnceAsync('http://127.0.0.1:3000', (data) => { console.log(data) })
// requestOnceAsync('http://127.0.0.1:3000', (data) => { console.log(data) })
// setTimeout(() => {
//   requestOnceAsync('http://127.0.0.1:3000', (data) => { console.log(data) })
//   console.log('1000')
// }, 100)
// setTimeout(() => {
//   requestOnceAsync('http://127.0.0.1:3000', (data) => { console.log(data) })
//   console.log('2000')
// }, 2000)
export {
  createFetchOnce
}
