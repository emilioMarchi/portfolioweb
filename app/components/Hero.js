'use client'

import { useState, useEffect, useRef } from 'react'
import { useUI } from './UIContext'

export default function Hero() {
  const { openChat, closeChat } = useUI()

  const [showContent, setShowContent] = useState(false)
  const [message, setMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [userId, setUserId] = useState(null)
  const [apiKey, setApiKey] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Inicializar usuario con Firebase Auth
  useEffect(() => {
    const initUser = async () => {
      if (typeof window === 'undefined') {
        setIsInitializing(false)
        return
      }
      
      try {
        // Importar Firebase dinámicamente
        const { initializeApp } = await import('firebase/app')
        const { getAuth, signInAnonymously } = await import('firebase/auth')
        
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        }
        
        // Solo inicializar si hay config válida
        if (firebaseConfig.apiKey && firebaseConfig.projectId) {
          const app = initializeApp(firebaseConfig)
          const auth = getAuth(app)
          
          // Login anónimo
          const result = await signInAnonymously(auth)
          const user = result.user
          const token = await user.getIdToken()
          
          localStorage.setItem('chatbot_userId', user.uid)
          localStorage.setItem('chatbot_authToken', token)
          
          setUserId(user.uid)
          setApiKey(token) // Usar token como apiKey
        } else {
          throw new Error('Sin config de Firebase')
        }
      } catch (e) {
        console.warn('Firebase Auth no disponible:', e)
        // Fallback: usar sesión simple
        let storedUserId = localStorage.getItem('chatbot_userId')
        if (!storedUserId) {
          storedUserId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
          localStorage.setItem('chatbot_userId', storedUserId)
        }
        setUserId(storedUserId)
        setApiKey('fallback_' + storedUserId)
      }
      
      setIsInitializing(false)
    }
    
    initUser()
  }, [])

  useEffect(() => {
    let i = 0
    const fullMessage = "// LA TECNOLOGÍA DEBERÍA SER PARA TODOS.\n// CREAMOS HERRAMIENTAS QUE CONECTAN,\n// AUTOMATIZAN Y HACEN CRECER TU NEGOCIO."
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
    
    // Si es mobile, centrar la vista en el chat
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const chatElement = document.getElementById('hero-chat-wrapper');
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  const handleCloseChat = () => {
    setShowChat(false)
    closeChat()
  }

  return (
    <section id="hero" className="hero-section">
      <div className={`hero-container ${showChat ? 'chat-active' : ''}`}>
        
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
            Democratización Digital
          </div>
          
          <div className={`hero-message ${showChat ? 'chat-active' : ''}`}>
            {message}<span style={styles.cursor}>|</span>
          </div>
          
          <div style={{
            ...styles.buttons,
            opacity: showContent ? (showChat ? 0 : 1) : 0,
            pointerEvents: showChat ? 'none' : 'auto',
            justifyContent: showChat ? 'flex-start' : 'center',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <button onClick={handleChat} style={styles.primaryButton}>
              <span style={styles.statusDotAnim} />
              <span>OVNI en línea</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button onClick={handleChat} style={styles.secondaryButton}>
              <span>Iniciar Guía IA</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
        
        {showChat && !isInitializing && (
          <div id="hero-chat-wrapper" className="chat-wrapper">
            <ChatPanel userId={userId} apiKey={apiKey} onClose={handleCloseChat} />
          </div>
        )}
      </div>
    </section>
  )
}

function ChatPanel({ userId, apiKey, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollContainerRef = useRef(null)

  // Recuperar sesión actual al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('ovni_hero_session')
      if (savedSession) {
        setMessages(JSON.parse(savedSession))
      }
    }
  }, [])

  // Guardar mensajes en la sesión
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ovni_hero_session', JSON.stringify(messages))
    }
  }, [messages])

  // Scroll automático al final
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Cargar saludo inicial solo si la sesión está vacía
  useEffect(() => {
    const fetchInitialState = async () => {
      if (!userId || messages.length > 0) return
      setIsLoading(true)
      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, apiKey, message: '' })
        })
        const data = await response.json()
        
        if (data.reply) {
          setMessages([{ role: 'bot', content: '', typing: true, fullContent: data.reply }])
        }
      } catch (error) {
        setMessages([{ role: 'bot', content: '¡Hola! Soy OVNI. ¿En qué puedo ayudarte?', typing: false }])
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialState()
  }, [userId])


  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !userId) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, typing: false }])
    
    // Primero mostrar estado "cargando" sin mensaje
    setMessages(prev => [...prev, { role: 'bot', content: '', loading: true, typing: false }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          clientId: 'client1', 
          message: userMessage,
          apiKey
        })
      })
      const data = await response.json()
      if (data.reply) {
        // Reemplazar el mensaje de loading con el real y typewriter
        setMessages(prev => {
          const newMsgs = prev.filter(m => !m.loading)
          return [...newMsgs, { role: 'bot', content: '', typing: true, fullContent: data.reply }]
        })
      }
    } catch (error) {
      setMessages(prev => {
        const newMsgs = prev.filter(m => !m.loading)
        return [...newMsgs, { role: 'bot', content: 'Error de conexión.', typing: false }]
      })
    } finally {
      setIsLoading(false)
    }
  }

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
  }, [messages.length > 0 && messages[messages.length - 1]?.typing])

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
            {msg.role === 'bot' && !msg.loading && (
              <div style={styles.botAvatar}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                </svg>
              </div>
            )}
            <div style={{
              ...styles.chatMsg,
              backgroundColor: 'transparent',
              border: msg.role === 'user' ? '1px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.2)',
              fontFamily: msg.role === 'bot' ? "'JetBrains Mono', monospace" : 'inherit',
              fontSize: msg.role === 'bot' ? '14px' : '15px',
            }}>
              {/* Loading: mostrar animación de puntos */}
              {msg.loading ? (
                <span style={styles.dotsLoading}>
                  <span style={{...styles.dot, animationDelay: '0s'}}>.</span>
                  <span style={{...styles.dot, animationDelay: '0.2s'}}>.</span>
                  <span style={{...styles.dot, animationDelay: '0.4s'}}>.</span>
                </span>
              ) : (
                <>
                  {msg.content}
                  {msg.typing && msg.role === 'bot' && (
                    <span style={styles.typingCursor}>|</span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
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
    padding: '',
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
    padding: '0.8rem 1.8rem',
    background: 'transparent',
    border: '1px solid rgba(20, 184, 166, 0.5)',
    borderRadius: '30px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
  },
  statusDotAnim: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 10px #22c55e',
    animation: 'pulse 2s infinite',
  },
  secondaryButton: {
    padding: '0.8rem 1.8rem',
    background: 'transparent',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '30px',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    backdropFilter: 'blur(8px)',
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
    background: 'var(--color-primary)',
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
    background: 'var(--color-primary)',
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
  dotsLoading: {
    display: 'inline-flex',
    gap: '2px',
  },
  dot: {
    color: '#5eead4',
    fontSize: '18px',
    fontWeight: 'bold',
    animation: 'bounce 1.4s infinite ease-in-out both',
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
