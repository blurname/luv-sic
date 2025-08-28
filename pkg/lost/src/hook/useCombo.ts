import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { buffer, debounceTime } from 'rxjs/operators'

type ComboSheet = {
  [key: string]: () => void
}
const useCombo = (comboSheet: ComboSheet) => {
  useEffect(() => {
    const keyDown$ = fromEvent(document, 'keydown')
    // 使用buffer操作符将连续的按键事件缓存为数组
    const keyCombination$ = keyDown$.pipe(
      buffer(keyDown$.pipe(debounceTime(300))) // 在最后一个按键后等待 300ms 触发缓存
      // filter((keys: KeyboardEvent[]) => {
      //   const combo = keys.map(keys => keys.key).join('')
      //   return isMeetSeason(combo) !== undefined
      // }) // 确保按键数量与目标组合键一致
    )
    // 订阅组合键事件
    const sub = keyCombination$.subscribe((comboP) => {
      const combo = comboP.map((keyE) => (keyE as KeyboardEvent).key).join('+')
      console.log('combo', combo)
      comboSheet[combo]?.()
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])
}
export { useCombo }
