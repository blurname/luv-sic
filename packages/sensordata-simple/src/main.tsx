import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { RemeshRoot } from 'remesh-react'

ReactDOM.render(
  <React.StrictMode>
    <RemeshRoot>
      <App />
    </RemeshRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
