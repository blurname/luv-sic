import React, { useState } from 'react'
import { listenClick, canvas } from './sdk/event'
listenClick()
canvas
function App() {
  const click = (e) => {
    console.log(e)
  }
  return (
    <div className="App">
      <a onClick={click}>lsakjdf</a>
    </div>
  )
}

export default App
