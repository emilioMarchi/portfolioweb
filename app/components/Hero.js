'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from './ChatContext'

export default function Hero() {
  const { openChat, closeChat } = useChat()
  const [showContent, setShowContent] = useState(false)
  const [message, setMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  
  const fullMessage = "// LA TECNOLOGÍA DEBERÍA SER PARA TODOS.\n// CREAMOS HERRAMIENTAS QUE CONECTAN,\n// AUTOMATIZAN Y HACEN CRECER TU NEGOCIO."
  
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullMessage.length) {
        setMessage(fullMessage.slice(0, i))
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => setShowContent(true), 500)
      }
    }, 40)
    
    return () => clearInterval(timer)
  }, [])

  const handleChat = () => {
    setShowChat(true)
    openChat()
  }

  const handleCloseChat = () => {
    setShowChat(false)
    closeChat()
  }

  return (
    <section id="hero" style={styles.hero}>
      <div style={{
        ...styles.container,
        maxWidth: showChat ? '1200px' : '800px',
        flexDirection: showChat ? 'row' : 'column',
        alignItems: showChat ? 'flex-start' : 'center',
        gap: showChat ? '50px' : '0'
      }}>
        
        {/* Contenido del Hero - se difumina cuando aparece el chat */}
        <div style={{
          ...styles.content,
          flex: showChat ? '1' : 'none',
          textAlign: showChat ? 'left' : 'center',
          marginTop: showChat ? '20px' : '0',
          opacity: showChat ? 0.5 : 1,
          filter: showChat ? 'blur(4px)' : 'none',
          pointerEvents: showChat ? 'none' : 'auto',
          transition: 'all 0.5s ease',
        }}>
          <div style={{
            ...styles.badge,
            opacity: showContent ? 1 : 0,
            alignSelf: showChat ? 'flex-start' : 'center',
          }}>
            <span style={styles.badgeDot} />
            Transformación Digital
          </div>
          
          <pre style={{
            ...styles.message,
            fontSize: showChat ? 'clamp(1rem, 2vw, 1.3rem)' : 'clamp(1.2rem, 3vw, 1.8rem)',
            textAlign: showChat ? 'left' : 'center',
          }}>
            {message}<span style={styles.cursor}>|</span>
          </pre>
          
          <div style={{
            ...styles.buttons,
            opacity: showContent ? (showChat ? 0 : 1) : 0,
            pointerEvents: showChat ? 'none' : 'auto',
            justifyContent: showChat ? 'flex-start' : 'center',
          }}>
            <button onClick={handleChat} style={styles.primaryButton}>
              <span>Chatear</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <a href="#productos" style={styles.secondaryButton}>Ver más</a>
          </div>
        </div>
        
        {/* Chat */}
        {showChat && (
          <div style={styles.chatWrapper}>
            <ChatPanel onClose={handleCloseChat} />
          </div>
        )}
      </div>
    </section>
  )
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '', typing: true, fullContent: '¡Hola! Soy OVNI. ¿En qué puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollContainerRef = useRef(null)
  
  const userId = typeof window !== 'undefined' ? localStorage.getItem('chatbot_userId') || `user_${Date.now()}` : `user_${Date.now()}`

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Efecto typewriter para el mensaje de bienvenida
  useEffect(() => {
    const welcomeMsg = messages[0]
    if (welcomeMsg && welcomeMsg.typing && welcomeMsg.fullContent) {
      let i = 0
      const timer = setInterval(() => {
        if (i <= welcomeMsg.fullContent.length) {
          setMessages(prev => [{
            ...prev[0],
            content: welcomeMsg.fullContent.slice(0, i)
          }])
          i++
        } else {
          clearInterval(timer)
          setMessages(prev => [{
            ...prev[0],
            typing: false
          }])
        }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, typing: false }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, clientId: 'client1', message: userMessage })
      })
      const data = await response.json()
      if (data.reply) {
        // Agregar mensaje con efecto typewriter
        setMessages(prev => [...prev, { role: 'bot', content: '', typing: true, fullContent: data.reply }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión.', typing: false }])
    } finally {
      setIsLoading(false)
    }
  }

  // Efecto typewriter para mensajes del bot
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'bot' && lastMsg.typing && lastMsg.fullContent) {
      let i = 0
      const timer = setInterval(() => {
        if (i <= lastMsg.fullContent.length) {
          setMessages(prev => {
            const newMsgs = [...prev]
            newMsgs[newMsgs.length - 1] = {
              ...newMsgs[newMsgs.length - 1],
              content: lastMsg.fullContent.slice(0, i)
            }
            return newMsgs
          })
          i++
        } else {
          clearInterval(timer)
          setMessages(prev => {
            const newMsgs = [...prev]
            newMsgs[newMsgs.length - 1] = {
              ...newMsgs[newMsgs.length - 1],
              typing: false
            }
            return newMsgs
          })
        }
      }, 20)
      return () => clearInterval(timer)
    }
  }, [messages.length > 0 && messages[messages.length - 1].typing])

  return (
    <div style={styles.chatPanel}>
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderLeft}>
          <div style={styles.chatAvatar}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            </svg>
          </div>
          <span style={styles.chatTitle}>OVNI</span>
        </div>
        <button onClick={onClose} style={styles.chatClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div ref={scrollContainerRef} style={styles.chatMessages}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.chatMsgWrapper,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'bot' && (
              <div style={styles.botAvatar}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                </svg>
              </div>
            )}
            <div style={{
              ...styles.chatMsg,
              backgroundColor: msg.role === 'user' ? 'transparent' : 'transparent',
              border: msg.role === 'user' ? '1px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.2)',
              fontFamily: msg.role === 'bot' ? "'JetBrains Mono', monospace" : 'inherit',
              fontSize: msg.role === 'bot' ? '14px' : '15px',
            }}>
              {msg.content}
              {msg.typing && msg.role === 'bot' && (
                <span style={styles.typingCursor}>|</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.chatMsgWrapper}>
            <div style={styles.botAvatar}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              </svg>
            </div>
            <div style={{...styles.chatMsg, border: '1px solid rgba(20, 184, 166, 0.2)'}}>
              <span style={styles.typing}>...</span>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={sendMessage} style={styles.chatInputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe..."
          style={styles.chatInput}
        />
        <button type="submit" style={styles.chatSendBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    margin: '0 auto',
    padding: '40px',
    display: 'flex',
    transition: 'all 0.5s ease-in-out',
    zIndex: 2,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  chatWrapper: {
    flex: '1.2',
    maxWidth: '480px',
    animation: 'fadeIn 0.4s ease',
  },
  chatPanel: {
    background: 'transparent',
    borderRadius: '20px',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    padding: '15px',
    boxShadow: '0 0 30px rgba(20, 184, 166, 0.1)',
  },
  message: {
    fontFamily: "'JetBrains Mono', monospace",
    color: '#5eead4',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    transition: 'all 0.5s ease',
  },
  cursor: {
    animation: 'blink 1s infinite',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: '50px',
    color: '#5eead4',
    fontSize: '11px',
    marginBottom: '1rem',
    width: 'fit-content',
  },
  badgeDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' },
  buttons: { display: 'flex', gap: '1rem', marginTop: '20px', transition: 'all 0.3s ease' },
  primaryButton: {
    padding: '0.8rem 1.5rem',
    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    border: 'none',
    borderRadius: '30px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryButton: {
    padding: '0.8rem 1.5rem',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '30px',
    color: '#94a3b8',
    textDecoration: 'none',
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(20, 184, 166, 0.2)',
    marginBottom: '10px',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  chatAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTitle: {
    color: '#5eead4',
    fontWeight: '600',
    fontSize: '13px',
  },
  chatClose: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '320px',
  },
  chatMsgWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  botAvatar: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatMsg: {
    padding: '12px 16px',
    borderRadius: '14px',
    maxWidth: '90%',
    fontSize: '15px',
    color: '#e2e8f0',
    lineHeight: 1.5,
    minHeight: '20px',
  },
  typingCursor: {
    color: '#5eead4',
    animation: 'blink 0.8s infinite',
    marginLeft: '2px',
  },
  typing: {
    color: '#64748b',
    fontSize: '11px',
  },
  chatInputArea: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(20, 184, 166, 0.2)',
  },
  chatInput: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    background: 'transparent',
    color: '#e2e8f0',
    fontSize: '13px',
    outline: 'none',
  },
  chatSendBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid rgba(20, 184, 166, 0.4)',
    color: '#5eead4',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
