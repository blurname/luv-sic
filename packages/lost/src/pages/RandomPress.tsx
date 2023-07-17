import { createUrlInit } from '@blurname/core/src/browser/url'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRefresh } from '../hooks/useRefresh'
import { fromEvent } from 'rxjs'

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
const tList = [t1, t2, t3, t4]
const urlInit = createUrlInit(urlConfig)
const style = urlInit()

const RandomPress = () => {
  const [screenKey, setScreenKey] = useState('')
  const [isPressed, setIsPressed] = useState(false)

  // useEffect(() => {
  // const aaa = fromEvent(document, 'keyup')
  // .subscribe((ke) => {
  // console.log(screenKey)
  // setScreenKey(ke.key)
  // if (!isPressed) {
  // setIsPressed(true)
  // }
  // })
  // return () => {
  // aaa.unsubscribe()
  // }
  // }, [isPressed])

  const res = screenKey.charCodeAt(0)
  let renderText = ''
  if (screenKey === 'Escape') {
    renderText = t0
  } else {
    renderText = isPressed ? tList[res % 4] : t0
  }
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
