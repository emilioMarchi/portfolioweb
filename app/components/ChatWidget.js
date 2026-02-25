'use client'

import { useState, useRef, useEffect } from 'react'
import { useUI } from './UIContext'

export default function ChatWidget() {
  const { isChatOpen, toggleChat, activeSection } = useUI()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewportHeight, setViewportHeight] = useState('85px')
  const [chatMaxHeight, setChatMaxHeight] = useState('520px')
  const [userId, setUserId] = useState(null)
  const [clientId, setClientId] = useState('client1')
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  
  const messagesEndRef = useRef(null)
  const hasFetchedInitial = useRef(false) // Previene múltiples peticiones iniciales

  // Sincronizar clientId - ELIMINADO: El chat flotante siempre es asistente
  useEffect(() => {
    setClientId('client1')
  }, [])

  // Setup inicial
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('ovni_user_id')
      if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('ovni_user_id', id)
      }
      setUserId(id)

      const savedSession = sessionStorage.getItem('ovni_chat_session')
      if (savedSession) {
        setMessages(JSON.parse(savedSession))
        hasFetchedInitial.current = true // Si hay sesión guardada, no pedimos saludo inicial
      }
    }

    const handleVisualViewportChange = () => {
      if (!window.visualViewport) return
      const vv = window.visualViewport
      const isKeyboardOpen = vv.height < window.innerHeight * 0.8
      
      if (isKeyboardOpen) {
        const offset = window.innerHeight - vv.height
        setViewportHeight(`${offset + 10}px`)
        setChatMaxHeight(`${vv.height - 80}px`)
      } else {
        setViewportHeight('85px')
        setChatMaxHeight('520px')
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange)
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange)
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange)
        window.visualViewport.removeEventListener('scroll', handleVisualViewportChange)
      }
    }
  }, [])

  // Guardar mensajes en la sesión
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ovni_chat_session', JSON.stringify(messages))
    }
  }, [messages])

  // Scroll automático
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [isChatOpen, messages, isLoading])

  // Cargar saludo inicial (SOLO UNA VEZ)
  useEffect(() => {
    if (isChatOpen && messages.length === 0 && userId && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true
      const fetchInitial = async () => {
        setIsLoading(true)
        try {
          const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, clientId, message: '' })
          })
          const data = await response.json()
          if (data.reply) {
            setMessages([{ role: 'bot', content: '', fullContent: data.reply, typing: true }])
          }
        } catch (e) {
          console.error('Error fetching initial greeting:', e)
          setMessages([{ role: 'bot', content: '¡Hola! Soy tu asistente de OVNI Studio. ¿En qué puedo ayudarte?', typing: false }])
        } finally {
          setIsLoading(false)
        }
      }
      fetchInitial()
    }
  }, [isChatOpen, userId, clientId, messages.length])

  // Efecto Typewriter
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
      }, 15)
      return () => clearInterval(timer)
    }
  }, [messages.length, messages[messages.length - 1]?.typing])

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
        body: JSON.stringify({ userId, clientId, message: userMessage })
      })

      const data = await response.json()
      
      if (data.reply) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: '', 
          fullContent: data.reply, 
          typing: true,
          accion: data.accion,
          target: data.target
        }])

        if (data.accion === 'GENERATE_SITE' && data.target) {
          try {
            const config = JSON.parse(data.target)
            setPreviewData(config)
            setTimeout(() => setShowPreview(true), 3000)
          } catch (e) {
            console.error('Error parseando target:', e)
          }
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Disculpa, tuve un problema. Intenta de nuevo.', typing: false }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión.', typing: false }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button onClick={toggleChat} style={styles.fab} className="ovni-fab">
        <div style={styles.ovniIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="14" rx="8" ry="3" fill="currentColor" opacity="0.3"/>
            <ellipse cx="12" cy="13" rx="8" ry="3" fill="currentColor"/>
            <ellipse cx="12" cy="12" rx="5" ry="2" fill="white" opacity="0.8"/>
            <circle cx="9" cy="11" r="0.5" fill="white"/>
            <circle cx="15" cy="11" r="0.5" fill="white"/>
            <ellipse cx="12" cy="17" rx="3" ry="1" fill="#f472b6" opacity="0.6"/>
          </svg>
        </div>
        {!isChatOpen && messages.length === 0 && <span style={styles.notificationDot} />}
      </button>

      {isChatOpen && (
        <div style={{
          ...styles.chatWindow,
          bottom: viewportHeight,
          maxHeight: chatMaxHeight,
          width: isMobile ? 'calc(100% - 40px)' : '320px'
        }}>
          <div style={styles.chatHeader}>
            <div style={styles.headerContent}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatarGlow} />
                <div style={styles.avatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={styles.headerText}>
                <span style={styles.headerTitle}>{clientId === 'site-designer' ? 'Web Designer' : 'OVNI Assistant'}</span>
                <span style={styles.headerStatus}>● En línea</span>
              </div>
            </div>
            <button onClick={toggleChat} style={styles.closeBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} style={{ ...styles.messageWrapper, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'bot' && (
                  <div style={styles.botAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    </svg>
                  </div>
                )}
                <div 
                  style={{
                    ...styles.message,
                    backgroundColor: msg.role === 'user' ? 'rgba(20, 184, 166, 0.15)' : 'rgba(30, 30, 50, 0.6)',
                    color: msg.role === 'user' ? '#5eead4' : '#e2e8f0',
                    border: msg.role === 'user' ? '1px solid rgba(20, 184, 166, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                  }}
                >
                  {msg.content}
                  {msg.typing && msg.role === 'bot' && (
                    <span style={styles.typingIndicator}>
                      <span style={styles.typingDot}></span>
                      <span style={styles.typingDot}></span>
                      <span style={styles.typingDot}></span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && !messages[messages.length - 1]?.typing && (
              <div style={styles.messageWrapper}>
                <div style={styles.botAvatar}><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7L12 12L22 7L12 2Z"/></svg></div>
                <div style={{...styles.message, backgroundColor: 'rgba(30, 30, 50, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
                  <span style={styles.typingIndicator}><span style={styles.typingDot}></span><span style={styles.typingDot}></span><span style={styles.typingDot}></span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={styles.inputArea}>
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              style={styles.input} disabled={isLoading}
            />
            <button type="submit" style={styles.sendBtn} disabled={isLoading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
          <div style={styles.footer}><span>Powered by OVNI Studio</span></div>
        </div>
      )}

      <style jsx>{`
        .ovni-fab { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
      `}</style>
    </>
  )
}

const styles = {
  fab: {
    position: 'fixed', bottom: '20px', left: '20px', width: '54px', height: '54px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)', color: '#fff', border: 'none',
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease',
  },
  ovniIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  notificationDot: {
    position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px',
    backgroundColor: '#f472b6', borderRadius: '50%', border: '2px solid #000',
  },
  chatWindow: {
    position: 'fixed', bottom: '85px', left: '20px', width: '320px', backgroundColor: '#0f0f1a',
    borderRadius: '20px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)', zIndex: 1000,
    display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  chatHeader: {
    padding: '16px 20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)',
  },
  headerContent: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarContainer: { position: 'relative' },
  avatarGlow: {
    position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
    borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', opacity: 0.5, filter: 'blur(8px)',
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  headerText: { display: 'flex', flexDirection: 'column' },
  headerTitle: { fontSize: '14px', fontWeight: '600', color: '#fff' },
  headerStatus: { fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' },
  closeBtn: { background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' },
  messages: { flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
  messageWrapper: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
  botAvatar: {
    width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  message: { padding: '12px 16px', borderRadius: '16px', maxWidth: '80%', fontSize: '14px', lineHeight: 1.5, wordBreak: 'break-word' },
  typingIndicator: { display: 'inline-flex', gap: '3px', marginLeft: '8px' },
  typingDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' },
  inputArea: { padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '8px' },
  input: {
    flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '14px', outline: 'none',
  },
  sendBtn: {
    width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  footer: { padding: '8px', textAlign: 'center', fontSize: '10px', color: '#9ca3af' },
  actionBtn: {
    backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 12px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginTop: '5px',
  },
  previewOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(5px)',
  },
  previewCard: {
    width: '90%', maxWidth: '400px', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
  },
  previewHeader: { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000' },
  previewContent: { padding: '20px', backgroundColor: '#f3f4f6' },
  previewSite: { border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', minHeight: '180px' },
  previewFooter: { padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center' },
  confirmBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
}
