type CreateTaskQueueProps = {
  limit: number
}
type Resolve = (value: unknown) => void
type AsyncFn = (...args: any) => Promise<unknown> 
const createTaskQueue = ({ limit }: CreateTaskQueueProps) => {
  let _taskLength = 0
  let _pendingList: [AsyncFn, Resolve][] = []
  let _resList: unknown[] = []

  const push = (asyncFn: AsyncFn) => {
    let _resolve!: Resolve
    const promise = new Promise((resolve)=> _resolve = resolve )
    if(_taskLength < limit){
      _taskLength +=1
      asyncFn()
        .then((res)=>{ console.log(res); _resList.push(res) })
        .catch(console.log)
        .finally(()=>{
          _taskLength -=1; _resolve(undefined)
          if(_pendingList.length <= 0) return
          const [t, r] = _pendingList.shift()!
          push(t).finally(() => r(undefined))
      })
    } else {
      _pendingList.push([asyncFn, _resolve])
    }
    return promise
  }

  return {
    push,
    getResList: () => _resList
  }
}

const main = async () => {
  const taskQueue = createTaskQueue({limit: 2})
  const testFn = (value: number) =>() => {
    return new Promise((resolve, reject)=> setTimeout(() => {
      if(value === -1) reject('why negative 1') 
        else resolve(value)
    }, 1000))
  }

  await Promise.all([
    taskQueue.push(testFn(1)), taskQueue.push(testFn(2)),
    taskQueue.push(testFn(-1)),
    taskQueue.push(testFn(3)), taskQueue.push(testFn(4)), taskQueue.push(testFn(5)),
    taskQueue.push(testFn(-1)),
    taskQueue.push(testFn(6)), taskQueue.push(testFn(7)),
  ])
  console.log(taskQueue.getResList())
  return 
}
main()
