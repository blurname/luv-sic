import React, { useState } from 'react'
import { EditingPage } from './pages/EditingPage'
type Page =
| 'Editing'
function App () {
  const [ activePage, setActivePage ] = useState<Page>('Editing')
  return (
    <div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {
        activePage === 'Editing' ? <EditingPage />
          : undefined
      }
    </div>
  )
}

export default App
