import { createUrlInit } from '@blurname/core/src/browser/url'
import React, { useEffect, useState } from 'react'
import { fromEvent } from 'rxjs'
import { buffer, debounceTime } from 'rxjs/operators'
import styled from 'styled-components'
import { themeConfig } from '../misc/urlConfig'

// 1. press chun, xia, qiu, dong to change text +
// 2. add animation

const t0 = '东西南北 宛尔目前 春夏秋冬 生于笔下'
const t1 = '好雨知时节 当春乃发生'
const t2 = '晚风吻尽荷花叶 让我醉到在池边'
const t3 = '已惯天涯莫浪愁 寒云衰草渐成秋'
const t4 = '还没好好的感受 雪花绽放的气候'

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

const urlInit = createUrlInit(themeConfig)
const style = urlInit()

const isMeetSeason = (combo: string) => {
  const season = [chun, xia, qiu, dong].filter((s) => {
    return s === combo
  })[0]
  return season
}

const RandomPress = () => {
  const [res, setRes] = useState('')

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
      const combo = comboP.map((keyE) => (keyE as KeyboardEvent).key).join('')
      const season = isMeetSeason(combo)
      setRes(season)
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  const renderText = tMap[res] || t0
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

export { RandomPress }
