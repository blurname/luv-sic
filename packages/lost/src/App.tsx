import React from 'react'
import { RandomPress } from './pages/RandomPress'
import { Lock } from './pages/Lock'
import { createUrlInit } from '@blurname/core/src/browser/url'
import { Paste } from './pages/Paste'
const urlConfig = {
  'lock': () => 'lock',
  'press': () => 'press',
  'paste': () => 'paste'
}
const urlInit = createUrlInit(urlConfig)
const page = urlInit()
function App () {
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {(page === undefined || page === 'lock') && <Lock/>}
      {page === 'press' && <RandomPress/>}
      {page === 'paste' && <Paste/>}
    </div>
  )
}

export {
  App
}
