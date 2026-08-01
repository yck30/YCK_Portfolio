import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Hero } from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Hero />
  </StrictMode>,
)
