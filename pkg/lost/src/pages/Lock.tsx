import { createUrlInit } from '@blurname/core/src/browser/url'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRefresh } from '../hooks/useRefresh'
import { themeConfig } from '../misc/urlConfig'

const text = `只要想起一生中后悔的事

梅花便落了下来

比如看她游泳到河的另一岸

比如登上一株松木梯子

危险的事固然美丽

不如看她骑马归来

面颊温暖

羞惭。低下头，回答着皇帝

一面镜子永远等侯她

让她坐到镜中常坐的地方

望着窗外，只要想起一生中后悔的事

梅花便落满了南山`
const textList = text.split('\n')

const urlInit = createUrlInit(themeConfig)
const style = urlInit()

const Lock = () => {
  const time = new Date()
  const refresh = useRefresh()
  useEffect(() => {
    const id = setInterval(() => {
      refresh()
    }, 60 * 1000)

    return () => {
      clearInterval(id)
    }
  }, [])
  const hour = time.getHours()
  const minute = time.getMinutes()
  return (
    <StyledLock className="lock" style={style}>
      <div className="time">
    <div className="h"> {hour} </div>
    <div className="m"> {minute} </div>
    </div>
    <div className="text">{
      textList.map((t, index) => {
        return <p key={index}>{t}</p>
      })
    }</div>
    </StyledLock>
  )
}

// https://juejin.cn/post/6892372242143903758 numTo汉字

const StyledLock = styled.div`
  width: 100%;
  height: 100%;
  font-size: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  //background: #f5f5f5;
  //color: #101010;
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

export { Lock }
