'use client'

import { useState, useRef, useEffect } from 'react'
import { getTemplateHtml } from '../../lib/templates/previewTemplates'

export default function DemoGenerator() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    // Detectar si es mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Pequeño delay para asegurar que el mensaje se renderizó
    setTimeout(scrollToBottom, 50)
  }, [messages])

  // Recuperar estado de la sesión actual al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('ovni_demo_session')
      const savedPreview = localStorage.getItem('ovni_demo_preview') // Cambiado a localStorage para que dure días
      
      if (savedSession) {
        setMessages(JSON.parse(savedSession))
        hasFetchedInitial.current = true // No pedir saludo inicial si ya hay sesión
      }
      
      if (savedPreview) {
        setPreviewData(JSON.parse(savedPreview))
        setCurrentStep('preview') // Restaurar vista de preview directamente
      }
    }
  }, [])

  // Guardar estado en la sesión cada vez que cambian
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ovni_demo_session', JSON.stringify(messages))
    }
    if (previewData) {
      localStorage.setItem('ovni_demo_preview', JSON.stringify(previewData)) // Guardar en localStorage
    }
  }, [messages, previewData])

  // Saludo inicial del diseñador
  useEffect(() => {
    if (hasFetchedInitial.current) return;
    
    const initDesigner = async () => {
      hasFetchedInitial.current = true
      setIsLoading(true)
      try {
        const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            clientId: 'site-designer', 
            message: '', 
            clearHistory: true // Limpiar historial en el backend al iniciar nueva sesión
          })
        })
        const data = await response.json()
        if (data.reply) {
          setMessages([{ role: 'bot', content: data.reply }])
        }
      } catch (e) {
        setMessages([{ role: 'bot', content: '¡Hola! Soy tu diseñador experto. ¿Qué nombre tiene tu negocio?' }])
      } finally {
        setIsLoading(false)
      }
    }
    
    // Solo iniciar si no había mensajes guardados
    if (messages.length === 0) {
      initDesigner()
    }
  }, [messages.length])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          clientId: 'site-designer', 
          message: userMessage 
        })
      })

      const data = await response.json()
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', content: data.reply }])
        
        if (data.accion === 'GENERATE_SITE' && data.target) {
          const config = JSON.parse(data.target)
          setPreviewData(config)
          setCurrentStep('generating')
          // Simular proceso de generación
          setTimeout(() => setCurrentStep('preview'), 3000)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setCurrentStep('chat')
    setPreviewData(null)
    setMessages([])
    setInput('')
    sessionStorage.removeItem('ovni_demo_session')
    localStorage.removeItem('ovni_demo_preview')
    
    setIsLoading(true)
    try {
      const userId = localStorage.getItem('ovni_user_id') || 'temp_user'
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          clientId: 'site-designer', 
          message: '', 
          clearHistory: true 
        })
      })
      const data = await response.json()
      if (data.reply) {
        setMessages([{ role: 'bot', content: data.reply }])
      }
    } catch (e) {
      setMessages([{ role: 'bot', content: '¡Hola! Soy tu diseñador experto. ¿Qué nombre tiene tu negocio?' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="demo" style={{
      ...styles.container,
      padding: isMobile ? '40px 20px' : '80px 40px',
    }}>
      <div style={styles.header}>
        <h2 style={{
          ...styles.title,
          fontSize: isMobile ? '2rem' : '3rem',
        }}>Experimentá la Generación con IA</h2>
        <p style={{
          ...styles.subtitle,
          fontSize: isMobile ? '1rem' : '1.2rem',
        }}>Hablá con nuestro agente diseñador y mirá cómo cobra vida tu sitio en tiempo real.</p>
      </div>

      <div style={{
        ...styles.workspace,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
        height: isMobile ? 'auto' : '600px',
        maxHeight: isMobile ? '800px' : '600px',
      }}>
        {/* Panel de Chat Izquierdo */}
        {(!isMobile || currentStep === 'chat') && (
          <div style={{
            ...styles.chatPanel,
            borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)',
            paddingRight: isMobile ? '0' : '20px',
            height: isMobile ? '500px' : '100%',
          }}>
            <div style={styles.chatMessages} ref={chatMessagesRef}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  ...styles.message,
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  {msg.content}
                </div>
              ))}
              {isLoading && <div style={styles.loading}>Diseñador pensando...</div>}
            </div>
            
            <form onSubmit={handleSendMessage} style={styles.inputArea}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí aquí..."
                style={styles.input}
                disabled={isLoading || currentStep !== 'chat'}
              />
              <button type="submit" style={styles.sendBtn} disabled={isLoading || currentStep !== 'chat'}>
                Enviar
              </button>
            </form>
          </div>
        )}

        {/* Panel de Preview Derecho */}
        {(!isMobile || currentStep !== 'chat') && (
          <div style={{
            ...styles.previewPanel,
            height: isMobile ? '500px' : '100%',
          }}>
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
              <p>Inyectando datos de {previewData?.nombre} en la plantilla {previewData?.tipo}</p>
            </div>
          )}

          {currentStep === 'preview' && previewData && (
            <div style={styles.previewContent}>
              <div style={styles.browserHeader}>
                <div style={styles.browserDots}><span/><span/><span/></div>
                <div style={styles.browserUrl}>Previsualización del sitio</div>
              </div>
              <iframe 
                style={styles.iframe}
                srcDoc={getTemplateHtml(previewData.tipo, previewData)}
              />
              <div style={styles.previewActions}>
                <button onClick={handleReset} style={styles.resetBtn}>
                  Reiniciar Diseño
                </button>
                <button 
                  onClick={() => {
                    const slug = previewData.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const p = previewData.colores?.primary?.replace('#', '') || '6366f1';
                    const s = previewData.colores?.secondary?.replace('#', '') || '0ea5e9';
                    const desc = encodeURIComponent(previewData.descripcion || '');
                    
                    const targetUrl = `/site-preview/${slug}?tipo=${previewData.tipo || 'landing'}&p=${p}&s=${s}&desc=${desc}`;
                    
                    window.open(targetUrl, '_blank');
                  }} 
                  style={styles.confirmBtn}
                >
                  Generar Emulación 🚀
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.1);
          border-left-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    padding: '80px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  header: { textAlign: 'center' },
  title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(to right, #fff, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto' },
  workspace: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '30px',
    height: '600px',
    maxHeight: '600px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '20px',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
  },
  chatPanel: { 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    overflow: 'hidden',
    gap: '20px', 
    borderRight: '1px solid rgba(255,255,255,0.05)', 
    paddingRight: '20px' 
  },
  chatMessages: { 
    flex: 1, 
    overflowY: 'auto', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px', 
    padding: '10px',
    scrollbarWidth: 'none', // Ocultar scrollbar en Firefox
  },
  message: { padding: '12px 16px', borderRadius: '16px', maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.4 },
  loading: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },
  inputArea: { display: 'flex', gap: '10px' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#fff', outline: 'none' },
  sendBtn: { backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' },
  previewPanel: { position: 'relative', overflow: 'hidden', borderRadius: '16px', backgroundColor: 'rgba(0,0,0,0.2)' },
  placeholder: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', gap: '10px', textAlign: 'center', padding: '40px' },
  placeholderIcon: { fontSize: '3rem' },
  generating: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  previewContent: { height: '100%', display: 'flex', flexDirection: 'column' },
  browserHeader: { backgroundColor: '#2d2d2d', padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' },
  browserDots: { display: 'flex', gap: '6px', '& span': { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#555' } },
  browserUrl: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: '4px', padding: '4px 12px', fontSize: '0.8rem', color: '#888' },
  iframe: { flex: 1, border: 'none', backgroundColor: '#fff' },
  previewActions: { display: 'flex', gap: '10px', position: 'absolute', bottom: '20px', right: '20px' },
  resetBtn: { padding: '8px 16px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500', backdropFilter: 'blur(5px)' },
  confirmBtn: { padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500', backdropFilter: 'blur(5px)' }
}
