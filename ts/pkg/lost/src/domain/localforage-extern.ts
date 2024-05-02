import localforage from 'localforage'
import type { Buffer } from './Buffer'
import { BufferRepoExtern } from './Buffer-extern'

const storageKey = 'buffer-data'
const getBufferList = async () => {
  return localforage.getItem<Buffer[]>(storageKey).then((value) => value ?? [])
}

const BufferRepoExternImpl = BufferRepoExtern.impl({

  async getBufferList () {
    return getBufferList()
  },

  async addBuffer (buffer: Buffer) {
    const data = await getBufferList()
    await localforage.setItem(storageKey, data.concat(buffer))
  },

  async removeBuffer (key) {
    const data = await getBufferList()
    await localforage.setItem(
      storageKey,
      data.filter((item) => item.key !== key)
    )
  },

  async updateBuffer (updateBuffer) {
    const data = await getBufferList()
    await localforage.setItem(
      storageKey,
      data.map((buffer) => (buffer.key === updateBuffer.key ? { ...buffer, ...updateBuffer } : buffer))
    )
  }
})
export {
  BufferRepoExternImpl
}
