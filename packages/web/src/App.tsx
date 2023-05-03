import React, { useRef, useState } from 'react'
// import { EditingPage } from './pages/EditingPage'
import { Elevator } from './pages/Elevator'
import { RxAnimationPage } from './pages/rxjs/animation/index.js'
type Pages = 'editing' | 'elevator' | 'rxjs-animation'
function App () {
  const [activePage, setActivePage] = useState<Pages>('rxjs-animation')
  const divRef = useRef(null)
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {activePage === 'elevator' && Elevator() }
      {activePage === 'rxjs-animation' && RxAnimationPage() }
      <span ref={divRef}></span>
    </div>
  )
}

export default App
