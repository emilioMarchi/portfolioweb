'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  const containerRef = useRef(null)
  const [currentSection, setCurrentSection] = useState(0)
  const lenisRef = useRef(null)
  const isScrolling = useRef(false)
  
  const sections = [
    { id: 'hero', name: 'Inicio' },
    { id: 'demo', name: 'Demo' }, // Agregada la sección Demo
    { id: 'productos', name: 'Productos' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'proceso', name: 'Proceso' },
    { id: 'tecnica', name: 'Técnica' },
    { id: 'contacto', name: 'Contacto' },
  ]

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      autoResize: true,   // Añadido para que Lenis se adapte a cambios de layout
      syncCallbacks: true // Añadido para sincronizar callbacks con el scroll
    })

    lenisRef.current = lenis

    // Detectar sección actual
    lenis.on('scroll', ({ scroll, limit }) => {
      const progress = scroll / limit
      const sectionIndex = Math.min(
        Math.floor(progress * sections.length),
        sections.length - 1
      )
      setCurrentSection(sectionIndex)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [sections.length])

  // Scroll a sección específica
  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index].id)
    if (section && lenisRef.current) {
      lenisRef.current.scrollTo(section, { offset: 0, duration: 1 })
    }
  }

  // Exponer función de scroll globalmente
  useEffect(() => {
    window.scrollToSection = scrollToSection
    window.currentSection = currentSection
    
    return () => {
      delete window.scrollToSection
      delete window.currentSection
    }
  }, [currentSection])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  )
}
