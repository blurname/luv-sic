import React, { useEffect, useRef } from 'react'

const Play = () => {
  return (
      <div>
      <OneLevelLoop></OneLevelLoop>
      {/* <TwoLeveloop></TwoLeveloop> */}
      </div>
  )
}
const RENDER_TIME = 300

const ONE_LEVEL_LOOP_ARRAY:number[] = Array(RENDER_TIME * RENDER_TIME).fill(1)

const useRenderTime = (componentName:string) => {
  const firstRef = useRef(new Date())
  useEffect(() => {
    const now = new Date().getTime()
    const old = firstRef.current.getTime()
    console.log(`${componentName}renderTime: `, 'now: ', now, 'old: ', old, 'cost: ', now - old)
  }, [])
}
const OneLevelLoop = () => {
  useRenderTime('OneLevelLoop')
  return (
  <div>
  {
      ONE_LEVEL_LOOP_ARRAY.map((i, index) => {
        return <div key={index}>{i}</div>
      })
    }
  </div>
  )
}

const TWO_LEVEL_LOOP_ARRAY:number[][] = Array(RENDER_TIME).fill(Array(RENDER_TIME).fill(1))
const TwoLeveloop = () => {
  useRenderTime('TwoLevelLoop')
  return (
    <div>
    {
        TWO_LEVEL_LOOP_ARRAY.map((i, index) => {
          return i.map((ii, iiIndex) => {
            return (
            <div key={`${index + 1}${iiIndex}`}>{ii}</div>
            )
          })
        })
      }
    </div>
  )
}

export {
  Play
}
