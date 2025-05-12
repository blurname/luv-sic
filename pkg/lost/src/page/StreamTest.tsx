import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react'
const controller = new AbortController()
const signal = controller.signal
const StreamTest = () => {
  const fetchPromiseRef = useRef<Promise<any>>(null)
  const [isInit, setIsInit] = useState(false)
  useEffect(() => {
    // fetch('/api/stream-html')
    // if(!isInit){
    fetch('/api/sse', { signal })
    // }else {
    //   setIsInit(true)
    // }
    return () => {
      // controller.abort()
    }
  }, [])
  return (
    <div>StreamTest</div>
  )
}
export {
  StreamTest
}
