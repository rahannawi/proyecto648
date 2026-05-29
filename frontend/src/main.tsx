// ESTE ARCHIVO SIRVE PARA:
// Actuar como el punto de entrada (Entry Point) del frontend de React en el navegador web.
// Es el primer archivo de JavaScript/TypeScript que se ejecuta al cargar la página.
// Su función principal es renderizar el componente raíz <App /> e insertarlo físicamente dentro del contenedor DOM '#root' de index.html.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Importa los estilos CSS globales y el sistema de diseño (variables, glassmorphism, botones)

// Buscamos el elemento HTML con el ID 'root' en index.html, creamos la raíz de React y renderizamos
// nuestra aplicación dentro de él usando el modo estricto para advertencias de buenas prácticas.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

