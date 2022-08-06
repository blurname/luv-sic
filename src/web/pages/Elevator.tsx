import React, { useEffect, useRef, useState } from 'react'
import { Observable, switchMap, fromEvent, interval, map, concatWith, take } from 'rxjs'
export function Elevator() {
  const [floor] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const elevatorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    clickMe(elevatorRef.current!).subscribe((x) => console.log(x))
  }, [])
  const changeFloor = (n: number) => {
    const ne = Object.assign(new Event('click'), { targetFloor: n })
    elevatorRef.current!.dispatchEvent(ne)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f002' }}>
      {floor.map((n, i) => (
        <button key={i} onClick={() => changeFloor(n)}>
          {n}
        </button>
      ))}
      <div style={{ display: 'none' }} ref={elevatorRef} />
    </div>
  )
}
const clickMe = (ref: HTMLElement) => {
  return fromEvent(ref, 'click').pipe(
    switchMap((event) => {
      const { targetFloor } = event
      console.log('where are you target', targetFloor)
      const realTargetFloor = targetFloor ?? 3
      const down = interval(10).pipe(
        map((x) => 10 - x),
        take(realTargetFloor),
      )
      const up = interval(10).pipe(
        map((x) => x + 1),
        take(realTargetFloor),
        concatWith(down),
      )
      return up
    }),
  )
}
// 如果 subscribe，那么就会跑一次完整的函数 callback,
// subscribe 里的 args ，只是对应 recive 对应 action notifaction
const observable = new Observable((subscriber) => {
  let a = 0
  subscriber.next(a++)
  subscriber.next(a++)
  subscriber.next(a++)
  subscriber.next(a++)
  // 如果 complete，接下去的 complete 就不会执行
  setTimeout(() => {
    subscriber.next(a++)
    subscriber.complete()
  }, 1000)
})
