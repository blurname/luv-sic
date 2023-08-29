import { Remesh } from 'remesh'
import { from, map, merge, tap } from 'rxjs'
// import { uuid } from './uuid.js'
import { BufferRepoExtern } from './Buffer-extern.js'

const STORAGE_PREFIX = 'LOST_BUFFER'
type Buffer = {
  key: string
  zIndex: number
  content: string
}

const BufferDomain = Remesh.domain({
  name: 'BufferDomain',
  impl: (domain) => {
    const repo = domain.getExtern(BufferRepoExtern)

    const InitBufferListCommand = domain.command({
      name: 'InitBufferListCommand',
      impl: (_, bufferList: Buffer[]) => {
        return [BufferListState().new(bufferList)]
      }
    })

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

    const ActiveBufferState = domain.state<Buffer | undefined>({
      name: 'ActiveBufferState',
      default: undefined
    })

    const ActiveBufferQuery = domain.query({
      name: 'ActiveBufferQuery',
      impl ({ get }) {
        const activeBuffer = get(ActiveBufferState())
        return activeBuffer
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
        const newBuffer:Buffer = {
          key: `${STORAGE_PREFIX}_${nextZ}`,
          zIndex: nextZ,
          content: `${STORAGE_PREFIX}_${nextZ}`
        }

        return [BufferListState().new([...bufferList, newBuffer]), ActiveBufferState().new(newBuffer), AddBufferEvent(newBuffer)]
      }
    })

    const AddBufferEvent = domain.event<Buffer>({
      name: 'AddBufferEvent'
    })

    const DelBufferCommand = domain.command({
      name: 'RemoveTodoCommand',
      impl ({ get }, key: Buffer['key']) {
        const todoList = get(BufferListState())
        const newTodoList = todoList.filter((buffer) => buffer.key !== key)
        const newActiveBuffer = newTodoList.at(-1)

        return [BufferListState().new(newTodoList), ActiveBufferState().new(newActiveBuffer), DelBufferEvent(key)]
      }
    })

    const DelBufferEvent = domain.event<Buffer['key']>({
      name: 'DelBufferEvent'
    })

    const UpdateBufferContentCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl ({ get }, { key, content }:Pick<Buffer, 'key' | 'content'>) {
        const bufferList = get(BufferListState())
        const newBufferList = bufferList.map((buffer) => {
          if (buffer.key === key) {
            return { ...buffer, content }
          } else {
            return buffer
          }
        })

        const nextBuffer = newBufferList.find(buf => buf.key === key)
        if (!nextBuffer) return null

        return [BufferListState().new(newBufferList), UpdateBufferEvent(nextBuffer)]
      }
    })

    const UpdateBufferEvent = domain.event<Buffer>({
      name: 'UpdateBufferEvent'
    })

    const UpdateActiveBufferCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl ({ get }, key :Buffer['key']) {
        const bufferList = get(BufferListState())
        const nextBuffer = bufferList.find(buf => buf.key === key)

        return [ActiveBufferState().new(nextBuffer)]
      }
    })

    domain.effect({
      name: 'FromRepoToStateEffect',
      impl () {
        return from(repo.getBufferList()).pipe(map((todos) => InitBufferListCommand(todos)))
      }
    })

    domain.effect({
      name: 'FromStateToRepoEffect',
      impl: ({ fromEvent }) => {
        const addBuffer$ = fromEvent(AddBufferEvent).pipe(tap((buffer) => repo.addBuffer(buffer)))

        const removeBuffer$ = fromEvent(DelBufferEvent).pipe(tap((key) => repo.removeBuffer(key)))

        const updateTodo$ = fromEvent(UpdateBufferEvent).pipe(tap((buffer) => repo.updateBuffer(buffer)))

        return merge(addBuffer$, removeBuffer$, updateTodo$).pipe(map(() => null))
      }
    })

    // domain.effect({
    //   name: 'InitEffect',
    //   impl: () => {
    //     for (let x = 0; x < localStorage.length; x++) {
    //       const key = localStorage.key(x)
    //       if (key?.includes(STORAGE_PREFIX)) {
    //         _tabData.set(key, JSON.parse(localStorage.getItem(key) as string)as TabItem)
    //       }
    //     }
    //
    //     console.log('tabSize', _tabData.size)
    //     if (_tabData.size === 0) {
    //       const newKey = `${STORAGE_PREFIX}_1`
    //       _tabData.set(newKey, {
    //         key: newKey,
    //         content: '',
    //         zIndex: getNextZ()
    //       })
    //     }
    //   }
    // })

    return {
      query: {
        BufferListQuery,
        ActiveBufferQuery
      },
      command: {
        AddBufferCommand,
        DelBufferCommand,
        UpdateBufferContentCommand,
        UpdateActiveBufferCommand
        // ToggleTodoCompletedCommand,
        // ToggleAllTodoCompletedCommand,
        // UpdateTodoCommand,
        // ClearCompletedCommand
      }
      // event: { AddTodoFailedEvent }
    }
  }
})
export type {
  Buffer
}
export {
  BufferDomain
}
