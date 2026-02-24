'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¡Hola! Soy el asistente IA de OVNI Studio. ¿En qué puedo ayudarte?' }
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

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Conectar con el API del chatbot (serverless)
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
        setMessages(prev => [...prev, { role: 'bot', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Disculpa, tuve un problema. Intenta de nuevo.' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión. ¿Está corriendo el agente?' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.fab}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <span>Asistente IA</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
          </div>
          
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.message,
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? '#0070f3' : '#f0f0f0',
                  color: msg.role === 'user' ? '#fff' : '#333',
                }}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{...styles.message, backgroundColor: '#f0f0f0'}}>
                Escribiendo...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              style={styles.input}
              disabled={isLoading}
            />
            <button type="submit" style={styles.sendBtn} disabled={isLoading}>
              →
            </button>
          </form>
        </div>
      )}
    </>
  )
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '350px',
    height: '450px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    padding: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.25rem',
    cursor: 'pointer',
  },
  messages: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  message: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    maxWidth: '80%',
    fontSize: '0.875rem',
    lineHeight: 1.4,
  },
  inputArea: {
    padding: '0.75rem',
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.875rem',
    outline: 'none',
  },
  sendBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
}
