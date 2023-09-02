import { Remesh } from 'remesh'
import { from, map, merge, tap } from 'rxjs'
import { uuid } from './uuid.js'
import { TodoRepoExtern } from './Buffer-extern.js'

const STORAGE_PREFIX = 'LOST_BUFFER'
type Buffer = {
  key: string
  zIndex: number
  content: string
}

export const BufferDomain = Remesh.domain({
  name: 'BufferDomain',
  impl: (domain) => {
    const repo = domain.getExtern(TodoRepoExtern)

    const BufferListState = domain.state<Buffer[]>({
      name: 'BufferListState',
      default: []
    })

    const BufferListQuery = domain.query({
      name: 'BufferListQuery',
      impl ({ get }) {
        const bufferList = get(BufferListState())
        return bufferList
      }
    })

    const BufferNextZQuery = domain.query({
      name: 'BufferNextZQuery',
      impl ({ get }) {
        const bufferList = get(BufferListQuery())
        let maxZ = 0
        for (const buffer of bufferList) {
          if (buffer.zIndex > maxZ) {
            maxZ = buffer.zIndex
          }
        }
        return maxZ + 1
      }
    })

    const AddBufferCommand = domain.command({
      name: 'AddBufferCommand',
      impl ({ get }) {
        const bufferList = get(BufferListState())
        const nextZ = get(BufferNextZQuery())
        const newKey = `${STORAGE_PREFIX}_${nextZ}`
        const buffer:Buffer = {
          key: newKey,
          zIndex: nextZ,
          content: ''
        }

        return [BufferListState().new([...bufferList, buffer])]
      }
    })

    const RemoveBufferCommand = domain.command({
      name: 'RemoveTodoCommand',
      impl ({ get }, key: Buffer['key']) {
        const todoList = get(BufferListState())
        const newTodoList = todoList.filter((buffer) => buffer.key !== key)

        return [BufferListState().new(newTodoList)]
      }
    })

    const UpdateBufferContentCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl ({ get }, { key, content }:Pick<Buffer, 'key' | 'content'>) {
        const bufferList = get(BufferListState())
        const newBufferList = bufferList.map((buffer) => {
          if (buffer.key === key) {
            return {
              ...buffer,
              content
            }
          } else {
            return buffer
          }
        })
        return [BufferListState().new(newBufferList)]
      }
    })

    return {
      query: {
        BufferListQuery
      },
      command: {
        AddBufferCommand,
        RemoveBufferCommand,
        UpdateBufferContentCommand
        // ToggleTodoCompletedCommand,
        // ToggleAllTodoCompletedCommand,
        // UpdateTodoCommand,
        // ClearCompletedCommand
      }
      // event: { AddTodoFailedEvent }
    }
  }
})
