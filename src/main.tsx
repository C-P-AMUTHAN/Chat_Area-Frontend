import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ChatContainer from './components/ChatContainer' // Import ChatContainer
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatContainer />  {/* Render ChatContainer */}
  </StrictMode>,
)
