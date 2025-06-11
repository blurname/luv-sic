const setTimeoutAsync = (ms:number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
export {
  setTimeoutAsync
}
