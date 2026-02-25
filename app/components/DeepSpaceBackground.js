'use client'

import { useEffect, useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'

export default function DeepSpaceBackground() {
  const canvasRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  // Parallax: las estrellas se mueven a diferentes profundidades según el scroll
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 500])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    let width = window.innerWidth
    let height = window.innerHeight
    
    const setCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Crear estrellas con diferentes propiedades para efecto 3D
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      depth: Math.random() * 0.8 + 0.2, // Factor de profundidad
      opacity: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * 0.05 + 0.01,
      pulseFactor: 0
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      const currentScroll = scrollY.get()

      // Dibujar Red (Grid) dinámica
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)'
      ctx.lineWidth = 1
      
      const gridSize = 60
      const gridOffset = (currentScroll * 0.2) % gridSize
      
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = gridOffset; y <= height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      stars.forEach(star => {
        // Efecto Parallax basado en profundidad y scroll
        let yPos = (star.y - currentScroll * star.depth) % height
        if (yPos < 0) yPos += height
        
        // Pulso de brillo
        star.pulseFactor += star.pulse
        const currentOpacity = star.opacity + Math.sin(star.pulseFactor) * 0.2
        
        ctx.beginPath()
        ctx.arc(star.x, yPos, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(94, 234, 212, ${currentOpacity})` // Color turquesa turquesa
        ctx.fill()
        
        // Glow sutil
        if (star.size > 1.2) {
          ctx.shadowBlur = 8
          ctx.shadowColor = 'rgba(20, 184, 166, 0.5)'
        } else {
          ctx.shadowBlur = 0
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [scrollY])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #0f0f1a, #0a0a14)',
      }}
    />
  )
}
