import './globals.css'
import Header from './components/Header'
import { UIProvider } from './components/UIContext'
import DeepSpaceBackground from './components/DeepSpaceBackground'

export const metadata = {
  title: 'OVNI Studio - Portfolio',
  description: 'Sitios web y servicios con IA para emprendedores',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <UIProvider>
          <DeepSpaceBackground />
          <Header />
          {children}
        </UIProvider>
      </body>
    </html>
  )
}

