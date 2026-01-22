export const createFetchOnce = () => {
  const URL_PROMSIE_CACHE_MAP = new Map<string, Promise<unknown>>()
  const requestOnceAsync = async (
    url: string,
    cb?: (requsetResult: unknown) => void
  ) => {
    let res = URL_PROMSIE_CACHE_MAP.get(url)
    if (!res) {
      URL_PROMSIE_CACHE_MAP.set(
        url,
        (res = new Promise((resolve, reject) => {
          fetch(url).then(async (data) => {
            cb?.(await data.text())
            resolve(data)
          }).catch(reject)
        }))
      )
    }
    return res
  }
  return { requestOnceAsync }
}
