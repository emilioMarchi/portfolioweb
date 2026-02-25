'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ScrollSection({ children, id, direction = 'up', initialDelay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px 0px -100px 0px" }) // Ampliar margen de detección

  // Definir la posición inicial según la dirección
  const getInitialPos = () => {
    switch (direction) {
      case 'up': return { y: 80, x: 0 }
      case 'down': return { y: -80, x: 0 }
      case 'left': return { y: 0, x: 80 }
      case 'right': return { y: 0, x: -80 }
      case 'fade': return { y: 0, x: 0 } // Para el DemoGenerator
      default: return { y: 0, x: 0 }
    }
  }

  const initialPos = getInitialPos()

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      ...initialPos,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: initialDelay, // Permite retrasar la animación si es necesario
      }
    },
  };

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
        // Eliminar propiedades que Lenis ya controla o que causan conflicto
        // perspective: '1000px', // Evitar transformaciones 3D si no son necesarias
      }}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}
