import React, { useState } from 'react'
import { listenInput, canvas } from './sdk/event'
import { EditingPage } from './pages/EditingPage'
//listenClick()
//canvas
type Page = 
| 'Editing'
function App() {
  const [activePage, setActivePage] = useState<Page>('Editing')
  return (
    <div style={{width:'100vw',height: '100vh', boxSizing:'border-box' }} className="App">
      { 
        activePage==='Editing' ? <EditingPage />
          : undefined
      }
    </div>
  )
}

export default App
