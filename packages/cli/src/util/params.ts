// accept params style

// xxx=yyy
const getCLIParams = () => {
  const paramList = process.argv.slice(2)
  const paramKV = {}
  paramList.forEach((s) => {
    const kvRes = s.split('=')
    if (kvRes.length == 2) {
      paramKV[kvRes[0]] = kvRes[1]
    } else if (kvRes.length === 1) {
      paramKV[kvRes[0]] = true
    } else {
      throw new Error('params input error')
    }
  })
  return { paramList, paramKV }
}

export {
  getCLIParams
}
