import React, { useEffect } from 'react'
import { useRefresh } from '../hooks/useRefresh'
const Lock = () => {
  const time = new Date()
  const refresh = useRefresh()
  useEffect(() => {
    const id = setInterval(() => {
      refresh()
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [])
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  // const timeStr = `${hour}:${minute}:${1}`
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: 'black'
      }}
    >
      <div
        style={{
          display: 'flex'
        }}
      >
        <div>
          <div
            style={{
              fontSize: 111,
              width: '100%'
            }}
          >
            {hour}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 199
            }}
          >
            {minute}
          </div>
        </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              fontSize: 199,
              width: 200
            }}
          >
            {second}
          </div>
      </div>
    </div>
  )
}
export { Lock }
