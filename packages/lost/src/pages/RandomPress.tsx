import { createUrlInit } from '@blurname/core/src/browser/url'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRefresh } from '../hooks/useRefresh'
import { fromEvent } from 'rxjs'
import { buffer, filter, map, debounceTime, bufferCount, scan, take, switchMap } from 'rxjs/operators'

const urlConfig = {
  'dt': () => ({
    background: '#0556a0',
    color: '#e7f6ff'
  }),
  'mb': () => ({
    background: '#f5f5f5',
    color: '#101010'
  }),
  'night': () => ({
    background: '#101010',
    color: '#f5f5f5',
    filter: 'brightness(20%)'
  })
}
// TODO
// 1. press chun, xia, qiu, dong to change text
// 2. add animation for

const t0 = '东西南北    宛尔目前    春夏秋冬    生于笔下'
const t1 = '好雨知时节    当春乃发生'
const t2 = '晚风吻尽荷花叶    让我醉到在池边'
const t3 = '已惯天涯莫浪愁，寒云衰草渐成秋'
const t4 = '还没好好的感受    雪花绽放的气候'
const urlInit = createUrlInit(urlConfig)
const style = urlInit()

const chun = 'chun'
const xia = 'xia'
const qiu = 'qiu'
const dong = 'dong'

const tMap = {
  [chun]: t1,
  [xia]: t2,
  [qiu]: t3,
  [dong]: t4
}

const RandomPress = () => {
  // const [screenKey, setScreenKey] = useState('')
  // const [isPressed, setIsPressed] = useState(false)
  const [res, setRes] = useState('')

  useEffect(() => {
    const keyDown$ = fromEvent(document, 'keydown')
    // 使用buffer操作符将连续的按键事件缓存为数组
    const keyCombination$ = keyDown$
      .pipe(
        // filter((event: KeyboardEvent) => targetKeys.includes(event.key)), // 过滤目标按键
        buffer(keyDown$.pipe(debounceTime(300))), // 在最后一个按键后等待 300ms 触发缓存
        // filter((event: KeyboardEvent) => event.key === targetKeys[0]), // 监听第一个按键
        // debounceTime(1000),
        // bufferCount(3), // 在 300ms 内连续按下的按键都会被缓存
        filter((keys: KeyboardEvent[]) => {
          const combo = keys.map(keys => keys.key).join('')
          console.log('pre', combo)
          return combo === 'chun' || combo === 'xia' || combo === 'qiu' || combo === 'dong'
          // console.log(keys)
          // return keys.length === targetKeys.length
        }) // 确保按键数量与目标组合键一致
      )
    // 订阅组合键事件
    const sub = keyCombination$.subscribe(comboP => {
      // console.log('combo', combo, )
      const combo = comboP.map(keys => keys.key).join('')

      if (combo === 'chun') {
        setRes('chun')
        console.log('chun')
      } else if (combo === 'xia') {
        setRes('xia')
        console.log('xia')
      } else if (combo === 'qiu') {
        setRes('qiu')
        console.log('qiu')
      } else if (combo === 'dong') {
        setRes('dong')
        console.log('dong')
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  // const res = screenKey.charCodeAt(0)
  const renderText = tMap[res] || t0

  // if (screenKey === 'Escape') {
  //   renderText = t0
  // } else {
  //   renderText = isPressed ? tList[res % 4] : t0
  // }
  return (
    <StyledLock className="lock" style={style}>
      <div>{renderText}</div>
    </StyledLock>
  )
}

const StyledLock = styled.div`
  width: 100%;
  height: 100%;
  font-size: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 100;
  .time {
    text-align: right;
  }
  .text {
    font-size: 20px;
    margin-left: 50px;
    writing-mode: vertical-rl;
  }
`

export {
  RandomPress
}
