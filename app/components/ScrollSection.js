'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function ScrollSection({ children, id, direction = 'up' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "0px" })

  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Animaciones de desvanecimiento basadas puramente en scroll para la salida
  const opacityScroll = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scaleScroll = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9])
  
  // Definir la posición inicial según la dirección
  const getInitialPos = () => {
    switch (direction) {
      case 'up': return { y: 100, x: 0 }
      case 'down': return { y: -100, x: 0 }
      case 'left': return { y: 0, x: 100 }
      case 'right': return { y: 0, x: -100 }
      default: return { y: 0, x: 0 }
    }
  }

  const initialPos = getInitialPos()
  
  return (
    <section 
      ref={ref} 
      id={id}
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
      }}
    >
      <motion.div
        style={{
          opacity: opacityScroll,
          scale: scaleScroll,
          width: '100%',
        }}
        initial={{ 
          opacity: 0, 
          scale: 0.9,
          ...initialPos 
        }}
        animate={isInView ? { 
          opacity: 1, 
          scale: 1,
          y: 0,
          x: 0
        } : { 
          opacity: 0,
          ...initialPos
        }}
        transition={{ 
          duration: 1, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}
