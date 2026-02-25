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
  
  // Animaciones basadas en la dirección
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1])
  
  // Dirección alternativa (reducida para evitar desbordes en móvil)
  const yReverse = useTransform(scrollYProgress, [0, 1], [-100, 0])
  const xLeft = useTransform(scrollYProgress, [0, 1], ['-10vw', '0vw'])
  const xRight = useTransform(scrollYProgress, [0, 1], ['10vw', '0vw'])
  
  // Seleccionar la transformación según la dirección
  let finalY = y
  if (direction === 'down') finalY = yReverse
  if (direction === 'left') {
    finalY = y
    var finalX = xRight
  }
  if (direction === 'right') {
    finalY = y
    var finalX = xLeft
  }
  
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
        // scrollSnapAlign: 'start',
        // scrollSnapStop: 'always',
        overflowX: 'hidden',
      }}
    >
      <motion.div
        style={{
          y: direction === 'right' || direction === 'left' ? 0 : finalY,
          x: direction === 'right' || direction === 'left' ? finalX : 0,
          opacity,
          scale,
          width: '100%',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // cubic-bezier para sensación premium
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}
