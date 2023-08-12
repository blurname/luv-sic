import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { RemeshRoot } from 'remesh-react'

const $container = document.getElementById('root')
const root = createRoot($container)
root.render(
  <React.StrictMode>
    <RemeshRoot>
      <App />
    </RemeshRoot>
  </React.StrictMode>
)
