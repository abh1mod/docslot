import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './ContextApi/AuthContext.jsx'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>

)
