'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const UIContext = createContext()

export function UIProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)
  const toggleChat = () => setIsChatOpen(prev => !prev)

  return (
    <UIContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      toggleChat,
      activeSection,
      setActiveSection
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
