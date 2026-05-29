// ESTE ARCHIVO SIRVE PARA:
// Actuar como el componente raíz de React (App). Aquí definimos el proveedor global de autenticación (AuthProvider)
// y configuramos todo el sistema de enrutamiento del lado del cliente (Client-Side Routing) usando react-router-dom.
// Esto permite navegar entre vistas (Equipos, Préstamos, Proveedores, Reseñas, Usuarios) de forma instantánea sin recargar la página.

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Reviews from './pages/Reviews';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// ESTE COMPONENTE AUXILIAR (ProtectedRoute) SIRVE PARA:
// Proteger rutas privadas del sistema de inventario.
// Evalúa si el usuario está autenticado usando el hook personalizado 'useAuth()'.
// Si no hay sesión activa, redirige automáticamente a la página de inicio de sesión (/login).
// Si está autenticado, permite ver e interactuar con el componente secundario (children).
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirige al login reemplazando la entrada actual en el historial de navegación.
    return <Navigate to="/login" replace />;
  }

  // Si pasa la validación, renderiza los componentes hijos protegidos.
  return <>{children}</>;
};

function App() {
  return (
    // envolvemos la app con AuthProvider para que toda la jerarquía de componentes pueda consultar el usuario autenticado.
    <AuthProvider>
      {/* BrowserRouter habilita el historial del navegador para realizar la navegación dinámica */}
      <BrowserRouter>
        <Routes>
          {/* Ruta Raíz (/): Redirige automáticamente al Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta del Login: Acceso público para iniciar sesión */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta del Catálogo de Equipos: Protegida, carga el Dashboard del inventario */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Ruta de Proveedores: Protegida, permite gestionar contactos */}
          <Route path="/proveedores" element={
            <ProtectedRoute>
              <Providers />
            </ProtectedRoute>
          } />
          
          {/* Ruta de Gestión de Usuarios: Protegida, exclusiva del rol Administrador */}
          <Route path="/usuarios" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          {/* Ruta de Préstamos: Protegida, gestiona las solicitudes y devoluciones */}
          <Route path="/prestamos" element={
            <ProtectedRoute>
              <Loans />
            </ProtectedRoute>
          } />
          
          {/* Ruta de Reseñas corporativas: Protegida, opiniones de los trabajadores */}
          <Route path="/reseñas" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

