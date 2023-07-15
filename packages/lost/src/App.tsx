import React from 'react'
import { RandomPress } from './pages/RandomPress'
function App () {
  // const [activePage, setActivePage] = useState<Pages>('elevator')
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      <RandomPress />
    </div>
  )
}

export {
  App
}
