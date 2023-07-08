import React, { useRef } from 'react'
// import { EditingPage } from './pages/EditingPage'
// import { Elevator } from './pages/Elevator'
// type Pages = 'editing' | 'elevator'
import { Lock } from './pages/Lock'
function App () {
  // const [activePage, setActivePage] = useState<Pages>('elevator')
  const divRef = useRef(null)
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      <Lock />
    </div>
  )
}

export {
  App
}
