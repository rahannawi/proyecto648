// ESTE ARCHIVO SIRVE PARA:
// Definir el componente de barra lateral (Sidebar) de navegación fija.
// Proporciona un menú de navegación visualmente elegante e interactivo para movernos entre las diferentes vistas de la app.
// Cuenta con lógica condicional para ocultar la opción de "Usuarios" a las personas que no tengan rol de Administrador.

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Server, Users, Archive, FileText, Truck, LogOut, MessageSquare } from 'lucide-react'; // Iconos modernos
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  // Obtenemos los datos del usuario logueado y la función logout del contexto de autenticación global
  const { user, logout } = useAuth();
  
  // Hook useNavigate de react-router-dom para redirigir programáticamente tras realizar acciones
  const navigate = useNavigate();

  // ESTA FUNCIÓN SIRVE PARA:
  // Controlar el evento de clic en "Cerrar Sesión".
  // Invoca el logout global (que limpia localStorage) y redirige al usuario de vuelta a la vista pública de Login.
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Detiene la navegación por defecto del enlace <a>
    logout();           // Limpia el estado de autenticación en React y en el navegador
    navigate('/login'); // Redirige al login de manera inmediata
  };

  // Objeto de estilos básico para cada enlace del menú de navegación.
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    marginBottom: '0.5rem',
    transition: 'all 0.2s',
    fontWeight: '500'
  };

  // Objeto de estilos específico que se aplica al enlace que se encuentra activo en ese momento.
  // Resalta visualmente dónde se encuentra parado el usuario mediante colores vibrantes y sombras sutiles.
  const activeStyle = {
    ...navStyle,
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
  };

  return (
    // 'glass-panel' es una clase global de CSS que aplica el diseño premium de Glassmorphism (efecto de vidrio traslúcido)
    <aside className="glass-panel" style={{ width: '280px', margin: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* SECCIÓN DE CABECERA: Despliega el nombre del sistema y el rol/nombre del usuario actual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', padding: '0.5rem', backgroundColor: 'var(--primary-color)', borderRadius: '10px' }}>
          <Server size={24} color="white" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em', display: 'block' }}>Net-Inventory</span>
          {user && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {/* Traduce dinámicamente el código numérico de rol a texto legible */}
              {user.role === 0 ? 'Admin' : user.role === 1 ? 'Técnico' : 'Usuario'} - {user.name.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      {/* SECCIÓN DE MENÚ (Navegación): Enlaces a las vistas principales */}
      <nav style={{ flex: 1 }}>
        {/* NavLink evalúa si su ruta coincide con la URL actual y, de ser así, inyecta los estilos de 'activeStyle' */}
        <NavLink to="/dashboard" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <Archive size={20} /> Equipos
        </NavLink>
        <NavLink to="/prestamos" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <FileText size={20} /> Préstamos
        </NavLink>
        
        <NavLink to="/proveedores" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <Truck size={20} /> Proveedores
        </NavLink>

        <NavLink to="/reseñas" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <MessageSquare size={20} /> Reseñas
        </NavLink>

        {/* COMPORTAMIENTO BASADO EN ROLES (PREGUNTA TÍPICA DE DEFENSA):
            Solo si hay un usuario logueado y su propiedad 'role' es estrictamente igual a 0 (Administrador),
            se evalúa el bloque && y se renderiza el botón de menú "Usuarios".
            Esto protege la interfaz del cliente para que técnicos o usuarios comunes no accedan a esta opción. */}
        {user && user.role === 0 && (
          <NavLink to="/usuarios" style={({isActive}) => isActive ? activeStyle : navStyle}>
            <Users size={20} /> Usuarios
          </NavLink>
        )}
      </nav>

      {/* PIE DE LA BARRA LATERAL: Botón para Cerrar Sesión */}
      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <a href="#" onClick={handleLogout} style={{...navStyle, color: '#ef4444'}}>
          <LogOut size={20} /> Cerrar Sesión
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;

