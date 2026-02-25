'use client'

import { useState, useRef, useEffect } from 'react'
import { useUI } from './UIContext'

export default function ChatWidget() {
  const { isChatOpen, openChat, closeChat, toggleChat } = useUI()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: '¡Hola! Soy OVNI, tu asistente de inteligencia artificial. Estoy aquí para ayudarte a crear tu presencia digital. ¿En qué puedo asistirte hoy?',
      typing: true 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Generar o recuperar userId de localStorage
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chatbot_userId');
      if (stored) return stored;
      const newId = `user_${Date.now()}`;
      localStorage.setItem('chatbot_userId', newId);
      return newId;
    }
    return `user_${Date.now()}`;
  })
  
  // Client ID para OVNI Studio
  const clientId = 'client1'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Sincronizar estado interno con contexto
  useEffect(() => {
    if (isChatOpen !== isOpen) {
      setIsOpen(isChatOpen)
    }
  }, [isChatOpen])

  // Actualizar contexto cuando cambia el estado interno
  useEffect(() => {
    if (isOpen !== isChatOpen) {
      if (isOpen) {
        openChat()
      } else {
        closeChat()
      }
    }
  }, [isOpen])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          clientId: clientId,
          message: userMessage
        })
      })

      const data = await response.json()
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', content: data.reply, typing: true }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Disculpa, tuve un problema al procesar tu solicitud. Intenta de nuevo.', typing: false }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión. ¿Está corriendo el agente?', typing: false }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Botón flotante mejorado - Ovni animado */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.fab}
        className="ovni-fab"
      >
        <div style={styles.ovniIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="14" rx="8" ry="3" fill="currentColor" opacity="0.3"/>
            <ellipse cx="12" cy="13" rx="8" ry="3" fill="currentColor"/>
            <ellipse cx="12" cy="12" rx="5" ry="2" fill="white" opacity="0.8"/>
            <circle cx="9" cy="11" r="0.5" fill="white"/>
            <circle cx="15" cy="11" r="0.5" fill="white"/>
            <ellipse cx="12" cy="17" rx="3" ry="1" fill="#f472b6" opacity="0.6"/>
          </svg>
        </div>
        {!isOpen && <span style={styles.notificationDot} />}
      </button>

      {/* Ventana de chat mejorada */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header con efecto de energía */}
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
                <span style={styles.headerTitle}>OVNI Assistant</span>
                <span style={styles.headerStatus}>● En línea</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          {/* Mensajes */}
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
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
                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                    border: msg.role === 'bot' ? '1px solid var(--color-border)' : 'none',
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
                <div style={styles.botAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  </svg>
                </div>
                <div style={{...styles.message, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)'}}>
                  <span style={styles.typingIndicator}>
                    <span style={styles.typingDot}></span>
                    <span style={styles.typingDot}></span>
                    <span style={styles.typingDot}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de input */}
          <form onSubmit={sendMessage} style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              style={styles.input}
              disabled={isLoading}
            />
            <button type="submit" style={styles.sendBtn} disabled={isLoading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
          
          {/* Footer decorativo */}
          <div style={styles.footer}>
            <span>Powered by OVNI Studio</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .ovni-fab {
          animation: float 3s ease-in-out infinite;
        }
        .ovni-fab:hover {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.8); }
        }
      `}</style>
    </>
  )
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',

    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.2)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  ovniIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '12px',
    height: '12px',
    backgroundColor: '#f472b6',
    borderRadius: '50%',
    border: '2px solid var(--color-bg)',
    animation: 'pulse 2s infinite',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '85px',
    left: '20px',
    width: '320px',
    maxHeight: '520px',

    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(99, 102, 241, 0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  chatHeader: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGlow: {
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
    opacity: 0.5,
    filter: 'blur(8px)',
    animation: 'pulse 2s infinite',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  headerStatus: {
    fontSize: '11px',
    color: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  messages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  botAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  message: {
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  typingIndicator: {
    display: 'inline-flex',
    gap: '3px',
    marginLeft: '8px',
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-text-muted)',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'var(--color-bg)',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  footer: {
    padding: '8px',
    textAlign: 'center',
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)',
  },
}
