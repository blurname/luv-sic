import React, { useRef, useState } from 'react'
import { EditingPage } from './pages/EditingPage'
import { Elevator } from './pages/Elevator'
type Pages = 'editing' | 'elevator'
function App() {
  const [activePage, setActivePage] = useState<Pages>('elevator')
  const divRef = useRef(null)
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {activePage === 'elevator' ? Elevator() : undefined}
      <span ref={divRef}></span>
    </div>
  )
}

export default App
