import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QuioscoProvider } from './context/QuioscoProvider'
import './index.css'
import Router from './Router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QuioscoProvider>
       <Router />
     </QuioscoProvider>
  </StrictMode>,
)
