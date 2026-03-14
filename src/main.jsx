import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PatternProvider } from './hooks/usePatternStore'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatternProvider>
      <App />
    </PatternProvider>
  </StrictMode>,
)
