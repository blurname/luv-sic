import React from 'react'
import { RandomPress } from './pages/RandomPress.js'
import { Lock } from './pages/Lock'
import { createUrlInit } from '@blurname/core/src/browser/url'
import { Paste } from './pages/Paste.js'
import { Buffer } from './pages/Buffer.js'
import { FigToJson } from './pages/FigToJson.js'
const urlConfig = {
  'lock': () => 'lock',
  'press': () => 'press',
  'paste': () => 'paste',
  'buffer': () => 'buffer',
  'fig': () => 'fig'
}
const urlInit = createUrlInit(urlConfig)
function App () {
  const page = urlInit()
  console.log('page:', page)
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {(page === undefined || page === 'lock') && <Lock/>}
      {page === 'buffer' && <Buffer/>}
      {page === 'press' && <RandomPress/>}
      {page === 'paste' && <Paste/>}
      {page === 'fig' && <FigToJson/>}
    </div>
  )
}

export {
  App
}
