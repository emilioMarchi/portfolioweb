'use client'

import SmoothScroll from './components/SmoothScroll'
import ScrollSection from './components/ScrollSection'
import NavigationOverlay from './components/NavigationOverlay'
import Hero from './components/Hero'
import Productos from './components/Productos'
import Servicios from './components/Servicios'
import Proceso from './components/Proceso'
import Tecnica from './components/Tecnica'
import Contacto from './components/Contacto'
import ChatWidget from './components/ChatWidget'

export default function Home() {
  return (
    <SmoothScroll>
      <main style={{ paddingTop: 0, marginTop: 0 }}>
        <NavigationOverlay />
        
        <ScrollSection id="hero" direction="up">
          <Hero />
        </ScrollSection>
        
        <ScrollSection id="productos" direction="left">
          <Productos />
        </ScrollSection>
        
        <ScrollSection id="servicios" direction="right">
          <Servicios />
        </ScrollSection>
        
        <ScrollSection id="proceso" direction="up">
          <Proceso />
        </ScrollSection>
        
        <ScrollSection id="tecnica" direction="down">
          <Tecnica />
        </ScrollSection>
        
        <ScrollSection id="contacto" direction="up">
          <Contacto />
        </ScrollSection>
      </main>
    </SmoothScroll>
  )
}
