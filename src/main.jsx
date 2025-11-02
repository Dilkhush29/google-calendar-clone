import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { CalendarProvider } from './contexts/CalendarContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CalendarProvider>
        <App />
      </CalendarProvider>
    </AuthProvider>
  </StrictMode>,
)
