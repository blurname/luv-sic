import { Remesh } from 'remesh'
import { from, map, merge, tap } from 'rxjs'
import { BufferRepoExtern } from './Buffer-extern'

// const STORAGE_PREFIX = 'LOST_BUFFER'
const newBufferName = () => {
  return new Date().toLocaleString()
}
const SHARING_MARK = '#[sharing31415926]'
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
      impl: ({ get }, bufferList: Buffer[]) => {
        const nextBufferList = bufferList
        if (bufferList.length === 0) {
          return [AddBufferCommand(), AddBufferFromSharingCommand()]
        }
        const { maxZBuffer } = get(BufferListMaxZQuery(nextBufferList))
        return [
          BufferListState().new(nextBufferList),
          UpdateActiveBufferCommand(maxZBuffer.key),
          AddBufferFromSharingCommand(),
        ]
      },
    })

    const BufferListState = domain.state<Buffer[]>({
      name: 'BufferListState',
      default: [],
    })

    const BufferListQuery = domain.query({
      name: 'BufferListQuery',
      impl({ get }) {
        const bufferList = get(BufferListState())
        return bufferList
      },
    })

    const ActiveBufferState = domain.state<Buffer | undefined>({
      name: 'ActiveBufferState',
      default: undefined,
    })

    const ActiveBufferQuery = domain.query({
      name: 'ActiveBufferQuery',
      impl({ get }) {
        const activeBuffer = get(ActiveBufferState())
        return activeBuffer
      },
    })

    const NextZQuery = domain.query({
      name: 'BufferNextZQuery',
      impl({ get }) {
        const { maxZ = 0 } = get(BufferListMaxZQuery())
        return maxZ + 1
      },
    })

    const BufferListMaxZQuery = domain.query({
      name: 'BufferMaxZQuery',
      impl({ get }, bufferListFromProps?: Buffer[]) {
        const bufferList = bufferListFromProps || get(BufferListQuery())
        let maxZ = bufferList[0]?.zIndex
        let maxZBuffer: Buffer = bufferList[0]
        for (const buffer of bufferList) {
          if (buffer.zIndex > maxZ) {
            maxZ = buffer.zIndex
            maxZBuffer = buffer
          }
        }
        return { maxZ, maxZBuffer }
      },
    })

    const AddBufferCommand = domain.command({
      name: 'AddBufferCommand',
      impl({ get }) {
        const bufferList = get(BufferListState())
        const nextZ = get(NextZQuery())
        const newBuffer: Buffer = {
          key: newBufferName(),
          zIndex: nextZ,
          content: '',
        }

        return [
          BufferListState().new([...bufferList, newBuffer]),
          UpdateActiveBufferCommand(newBuffer.key),
          AddBufferEvent(newBuffer),
        ]
      },
    })

    const AddBufferFromSharingCommand = domain.command({
      name: 'AddBufferFromSharingCommand',
      impl({ get }) {
        const url = location.href
        if (!url.includes(SHARING_MARK)) return []
        const bufferList = get(BufferListState())
        const nextZ = get(NextZQuery())
        const [nextHref, sharingContent] = url.split(SHARING_MARK)
        const newBuffer: Buffer = {
          key: newBufferName(),
          zIndex: nextZ,
          content: decodeURIComponent(sharingContent),
        }
        location.hash = ''

        return [
          BufferListState().new([...bufferList, newBuffer]),
          UpdateActiveBufferCommand(newBuffer.key),
          AddBufferEvent(newBuffer),
        ]
      },
    })

    const AddBufferEvent = domain.event<Buffer>({
      name: 'AddBufferEvent',
    })

    const DelBufferCommand = domain.command({
      name: 'DelBufferCommand',
      impl({ get }, key: Buffer['key']) {
        const todoList = get(BufferListState())
        const newTodoList = todoList.filter((buffer) => buffer.key !== key)
        const nextBuffer = newTodoList.at(-1)
        if (!nextBuffer) return null // 哇哦,自动实现了没有下一个就不删除的功能

        return [
          BufferListState().new(newTodoList),
          UpdateActiveBufferCommand(nextBuffer.key),
          DelBufferEvent(key),
        ]
      },
    })

    const DelBufferEvent = domain.event<Buffer['key']>({
      name: 'DelBufferEvent',
    })

    const UpdateBufferContentCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl({ get }, { key, content }: Pick<Buffer, 'key' | 'content'>) {
        const bufferList = get(BufferListState())
        const newBufferList = bufferList.map((buffer) => {
          if (buffer.key === key) {
            return { ...buffer, content }
          } else {
            return buffer
          }
        })

        const nextBuffer = newBufferList.find((buf) => buf.key === key)
        if (!nextBuffer) return null

        return [
          BufferListState().new(newBufferList),
          UpdateBufferEvent(nextBuffer),
        ]
      },
    })

    const UpdateBufferEvent = domain.event<Buffer>({
      name: 'UpdateBufferEvent',
    })

    const UpdateActiveBufferCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl: ({ get }, key: Buffer['key']) => {
        const bufferList = get(BufferListState())
        const nextBuffer = bufferList.find((buf) => buf.key === key)
        if (!nextBuffer) return null

        return [ActiveBufferState().new(nextBuffer)]
      },
    })

    const UpdateActiveBufferByDirectionCommand = domain.command({
      name: 'UpdateBufferContentCommand',
      impl: ({ get }, dir: 'next' | 'prev') => {
        const bufferList = get(BufferListState())
        const activeBuffer = get(ActiveBufferState())
        const activeIndex = bufferList.findIndex(
          (buf) => buf.key === activeBuffer?.key
        )
        let nextBuffer: Buffer
        if (dir === 'next') {
          nextBuffer = bufferList[activeIndex + 1]
        } else {
          nextBuffer = bufferList[activeIndex - 1]
        }
        if (!nextBuffer) return null

        return [ActiveBufferState().new(nextBuffer)]
      },
    })

    domain.effect({
      name: 'FromRepoToStateEffect',
      impl() {
        return from(repo.getBufferList()).pipe(
          map((bufferList) => InitBufferListCommand(bufferList))
        )
      },
    })

    domain.effect({
      name: 'FromStateToRepoEffect',
      impl: ({ fromEvent }) => {
        const addBuffer$ = fromEvent(AddBufferEvent).pipe(
          tap((buffer) => repo.addBuffer(buffer))
        )

        const removeBuffer$ = fromEvent(DelBufferEvent).pipe(
          tap((key) => repo.removeBuffer(key))
        )

        const updateTodo$ = fromEvent(UpdateBufferEvent).pipe(
          tap((buffer) => repo.updateBuffer(buffer))
        )

        return merge(addBuffer$, removeBuffer$, updateTodo$).pipe(
          map(() => null)
        )
      },
    })

    domain.effect({
      name: 'FromStateToRepoEffect',
      impl: ({ fromEvent }) => {
        const addBuffer$ = fromEvent(AddBufferEvent).pipe(
          tap((buffer) => repo.addBuffer(buffer))
        )

        const removeBuffer$ = fromEvent(DelBufferEvent).pipe(
          tap((key) => repo.removeBuffer(key))
        )

        const updateTodo$ = fromEvent(UpdateBufferEvent).pipe(
          tap((buffer) => repo.updateBuffer(buffer))
        )

        return merge(addBuffer$, removeBuffer$, updateTodo$).pipe(
          map(() => null)
        )
      },
    })

    return {
      query: {
        BufferListQuery,
        ActiveBufferQuery,
      },
      command: {
        AddBufferCommand,
        DelBufferCommand,
        UpdateBufferContentCommand,
        UpdateActiveBufferCommand,
        UpdateActiveBufferByDirectionCommand,
      },
      // event: { AddTodoFailedEvent }
    }
  },
})

export type { Buffer }
export { SHARING_MARK, BufferDomain }
