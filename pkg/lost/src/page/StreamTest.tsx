import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react'
const StreamTest = () => {
  useEffect(() => {
    // fetch('/api/stream-html')
    fetch('/api/sse')
    return () => {
    }
  }, [])
  return (
    <div>StreamTest</div>
  )
}
export {
  StreamTest
}
