import Hero from './components/Hero'
import Productos from './components/Productos'
import Servicios from './components/Servicios'
import Proceso from './components/Proceso'
import Tecnica from './components/Tecnica'
import Contacto from './components/Contacto'
import ChatWidget from './components/ChatWidget'

export default function Home() {
  return (
    <main>
      <Hero />
      <Productos />
      <Servicios />
      <Proceso />
      <Tecnica />
      <Contacto />
      <ChatWidget />
    </main>
  )
}
