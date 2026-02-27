'use client'

import { useState, useRef, useEffect } from 'react'
import { getTemplateHtml } from '../../lib/templates/previewTemplates'

export default function DemoGenerator() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTypingInitial, setIsTypingInitial] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [currentStep, setCurrentStep] = useState('chat') // chat | generating | preview
  const [isMobile, setIsMobile] = useState(false)
  const chatMessagesRef = useRef(null)
  const hasFetchedInitial = useRef(false)

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setTimeout(scrollToBottom, 50)
  }, [messages, isLoading])

  // Lógica de Typewriter para el Diseñador
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'bot' && lastMsg.typing && lastMsg.fullContent) {
      let i = 0
      const timer = setInterval(() => {
        if (i <= lastMsg.fullContent.length) {
          setMessages(prev => {
            const newMsgs = [...prev]
            const index = newMsgs.length - 1
            if (newMsgs[index]) {
              newMsgs[index] = {
                ...newMsgs[index],
                content: lastMsg.fullContent.slice(0, i)
              }
            }
            return newMsgs
          })
          i++
        } else {
          clearInterval(timer)
          setMessages(prev => {
            const newMsgs = [...prev]
            const index = newMsgs.length - 1
            if (newMsgs[index]) {
              newMsgs[index] = { ...newMsgs[index], typing: false }
            }
            return newMsgs
          })
        }
      }, 15)
      return () => clearInterval(timer)
    }
  }, [messages.length, messages[messages.length - 1]?.typing])

  // Carga inicial y recuperación
  useEffect(() => {
    if (hasFetchedInitial.current) return
    
    const initDesigner = async () => {
      hasFetchedInitial.current = true
      setIsLoading(true)
      const userId = localStorage.getItem('ovni_user_id') || 'temp_user'

      const savedPreview = localStorage.getItem(`ovni_demo_preview_${userId}`)
      if (savedPreview) {
        setPreviewData(JSON.parse(savedPreview))
        setCurrentStep('preview')
        setIsLoading(false)
        return
      }

      setMessages([{ role: 'bot', content: '', loading: true }])
      setIsTypingInitial(true)

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, clientId: 'site-designer', message: '' })
        })
        const data = await response.json()
        
        if (data.history && data.history.length > 0) {
          setMessages(data.history.map(m => ({ role: m.role, content: m.content, typing: false })))
        } else if (data.reply) {
          setMessages([{ role: 'bot', content: '', fullContent: data.reply, typing: true }])
        }
      } catch (e) {
        setMessages([{ role: 'bot', content: '¡Hola! Soy tu diseñador experto. ¿Qué nombre tiene tu negocio?', typing: false }])
      } finally {
        setIsLoading(false)
        setIsTypingInitial(false)
      }
    }
    
    initDesigner()
  }, [])

  // Guardar previewData
  useEffect(() => {
    if (typeof window !== 'undefined' && previewData) {
      const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
      localStorage.setItem(`ovni_demo_preview_${userId}`, JSON.stringify(previewData))
    }
  }, [previewData])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessages(prev => [...prev, { role: 'bot', content: '', loading: true }])
    setIsLoading(true)

    try {
      const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, clientId: 'site-designer', message: userMessage })
      })

      const data = await response.json()

      if (data.reply) {
        setMessages(prev => {
          const newMsgs = prev.filter(msg => !msg.loading)
          return [...newMsgs, { role: 'bot', content: '', fullContent: data.reply, typing: true, accion: data.accion, target: data.target }]
        })

        if (data.accion === 'GENERATE_SITE' && data.target) {
          const config = JSON.parse(data.target)
          setPreviewData(config)
          setCurrentStep('generating')
          setTimeout(() => setCurrentStep('preview'), 3000)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => prev.filter(m => !m.loading))
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
    setCurrentStep('chat')
    setPreviewData(null)
    setMessages([{ role: 'bot', content: '', loading: true }])
    setInput('')
    localStorage.removeItem(`ovni_demo_preview_${userId}`)
    hasFetchedInitial.current = true

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, clientId: 'site-designer', message: '', clearHistory: true })
      })
      const data = await response.json()
      if (data.reply) {
        setMessages([{ role: 'bot', content: '', fullContent: data.reply, typing: true }])
      }
    } catch (e) {
      setMessages([{ role: 'bot', content: '¡Hola! Empecemos de nuevo. ¿Qué nombre tiene tu negocio?', typing: false }])
    }
  }

  return (
    <div id="demo" style={{ ...styles.container, padding: isMobile ? '40px 20px' : '80px 40px' }}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, fontSize: isMobile ? '2rem' : '3rem' }}>Experimentá la Generación con IA</h2>
        <p style={{ ...styles.subtitle, fontSize: isMobile ? '1rem' : '1.2rem' }}>Hablá con nuestro agente diseñador y mirá cómo cobra vida tu sitio en tiempo real.</p>
      </div>

      <div style={{ ...styles.workspace, gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', height: isMobile ? 'auto' : '600px' }}>
        {(!isMobile || currentStep === 'chat') && (
        <div style={{ ...styles.chatPanel, borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)', paddingRight: isMobile ? '0' : '20px', height: isMobile ? '52vh' : '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div ref={chatMessagesRef} style={{ ...styles.chatMessages, flex: 1, minHeight: 0 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    ...styles.message,
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: msg.role === 'user' ? '#fff' : '#ccc',
                  }}>
                    {msg.loading || (msg.typing && msg.content === '') ? (
                      <span style={styles.typingDots}>
                        <span style={{ ...styles.dot, animationDelay: '0s' }} />
                        <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                        <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                      </span>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={styles.inputArea}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribí aquí..." style={styles.input} disabled={isLoading || currentStep !== 'chat'} />
              <button type="submit" style={styles.sendBtn} disabled={isLoading || currentStep !== 'chat'}>Enviar</button>
            </form>
          </div>
        )}

        {(!isMobile || currentStep !== 'chat') && (
          <div style={{ ...styles.previewPanel, height: isMobile ? '500px' : '100%' }}>
            {currentStep === 'chat' && (
              <div style={styles.placeholder}>
                <div style={styles.placeholderIcon}>✨</div>
                <p>Aquí aparecerá la previsualización de tu sitio mientras conversamos.</p>
              </div>
            )}
            {currentStep === 'generating' && (
              <div style={styles.generating}>
                <div className="spinner"></div>
                <h3>Generando arquitectura...</h3>
                <p>Inyectando datos de {previewData?.nombre}</p>
              </div>
            )}
            {currentStep === 'preview' && previewData && (
              <div style={styles.previewContent}>
                <div style={styles.browserHeader}>
                  <div style={styles.browserDots}><span/><span/><span/></div>
                  <div style={styles.browserUrl}>Previsualización en vivo</div>
                </div>
                <iframe style={styles.iframe} srcDoc={getTemplateHtml(previewData.tipo, previewData)} />
                <div style={styles.previewActions}>
                  <button onClick={handleReset} style={styles.resetBtn}>Reiniciar Diseño</button>
                  <button onClick={() => window.open(`/site-preview/${previewData.nombre.toLowerCase().replace(/\s/g, '-')}`, '_blank')} style={styles.confirmBtn}>Generar Emulación 🚀</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-left-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '40px' },
  header: { textAlign: 'center' },
  title: { fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #fff, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto' },
  workspace: { display: 'grid', gap: '30px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', backdropFilter: 'blur(20px)', overflow: 'hidden' },
  chatPanel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  chatMessages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px' },
  messageWrapper: { display: 'flex', width: '100%' },
  message: { padding: '12px 16px', borderRadius: '16px', maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.4 },
  typingDots: { display: 'inline-flex', alignItems: 'center', gap: '4px', height: '1.2rem' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out both' },
  inputArea: { display: 'flex', gap: '10px' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', outline: 'none' },
  sendBtn: { backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' },
  previewPanel: { position: 'relative', overflow: 'hidden', borderRadius: '16px', backgroundColor: 'rgba(0,0,0,0.2)' },
  placeholder: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', gap: '10px', textAlign: 'center' },
  placeholderIcon: { fontSize: '3rem' },
  generating: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  previewContent: { height: '100%', display: 'flex', flexDirection: 'column' },
  browserHeader: { backgroundColor: '#2d2d2d', padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' },
  browserDots: { display: 'flex', gap: '6px', '& span': { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#555' } },
  browserUrl: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: '4px', padding: '4px 12px', fontSize: '0.8rem', color: '#888' },
  iframe: { flex: 1, border: 'none', backgroundColor: '#fff' },
  previewActions: { display: 'flex', gap: '10px', position: 'absolute', bottom: '20px', right: '20px' },
  resetBtn: { padding: '8px 16px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer' },
  confirmBtn: { padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }
}
