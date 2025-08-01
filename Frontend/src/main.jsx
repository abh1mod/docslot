import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './ContextAPI/AuthContext'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>

)
