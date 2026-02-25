// Este layout oculta el Header y los elementos del RootLayout principal
// para la ruta de previsualización del sitio, simulando que estamos en otra web.

export default function SitePreviewLayout({ children }) {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'fixed', top: 0, left: 0, zIndex: 999999, backgroundColor: 'white' }}>
      {children}
    </div>
  )
}
