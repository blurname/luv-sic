const MOCK_OBJECT = {
  a1: {
    a11: {
      a111: 1,
      a112: 2
    }
  },
  a2: {
    a21: {
      a211: 1,
      a212: 2
    },
    a22: {
      a221: 1,
      a222: 2,
      a223: 3
    }
  }
}

const objectToKeyList = (object: Record<string, object >) => {
  const keyQueue = Object.keys(object)
  const keyList = []
  while (keyQueue.length !== 0) {
    const key = keyQueue.shift()
    if (!key) return
    keyList.push(key)
    console.log('🟦[blue]->object[key]: ', key, object[key])
    if (typeof object[key] === 'object') {
      for (const subKey of Object.keys(object[key])) {
        keyQueue.push(subKey)
      }
    }
  }
  console.log(keyList)
}

objectToKeyList(MOCK_OBJECT)
