import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/login.jsx'
import Register from './components/register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
    <Register />
    <App />
  </StrictMode>,
)
