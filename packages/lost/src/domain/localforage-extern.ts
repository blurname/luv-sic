import localforage from 'localforage'
import type { Buffer } from './Buffer.js'
import { TodoRepoExtern } from './Buffer-extern.js'

const storageKey = 'buffer-data'
const getTodoList = async () => {
  return localforage.getItem<Buffer[]>(storageKey).then((value) => value ?? [])
}

export const TodoRepoExternImpl = TodoRepoExtern.impl({
  async getTodoList () {
    return getTodoList()
  },
  async addTodo (todo: Buffer) {
    const data = await getTodoList()
    await localforage.setItem(storageKey, data.concat(todo))
  },

  async removeTodoByIds (ids) {
    const data = await getTodoList()
    await localforage.setItem(
      storageKey,
      data.filter((item) => !ids.includes(item.key))
    )
  },

  async updateTodo (updateTodo) {
    const data = await getTodoList()
    await localforage.setItem(
      storageKey,
      data.map((todo) => (todo.key === updateTodo.key ? { ...todo, ...updateTodo } : todo))
    )
  }

})
