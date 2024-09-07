import { Remesh } from 'remesh'
import type { Buffer } from './Buffer'

type BufferRepo = {
  getBufferList: () => Promise<Buffer[]>
  addBuffer: (todo: Buffer) => void
  removeBuffer: (key: Buffer['key']) => void
  updateBuffer: (updateBuffer: Buffer) => void
}

const BufferRepoExtern = Remesh.extern<BufferRepo>({
  default: {
    async getBufferList () {
      throw new Error('Not implemented')
    },
    async addBuffer () {
      throw new Error('Not implemented')
    },
    async removeBuffer () {
      throw new Error('Not implemented')
    },
    async updateBuffer () {
      throw new Error('Not implemented')
    }
  }
})
export {
  BufferRepoExtern
}
