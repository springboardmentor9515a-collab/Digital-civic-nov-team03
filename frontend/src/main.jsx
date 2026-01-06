import 'leaflet/dist/leaflet.css'
import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const container = document.getElementById('root')
if (!container) {
  console.error('Root container not found. Did you change index.html?')
} else {
  createRoot(container).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}
