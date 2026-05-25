import React from 'react';
import { NavLink } from 'react-router-dom';
import { Server, Users, Archive, FileText, Truck, LogOut } from 'lucide-react';

const Sidebar = () => {
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

  const activeStyle = {
    ...navStyle,
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
  };

  return (
    <aside className="glass-panel" style={{ width: '280px', margin: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', padding: '0.5rem', backgroundColor: 'var(--primary-color)', borderRadius: '10px' }}>
          <Server size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>Net-Inventory</span>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/dashboard" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <Archive size={20} /> Equipos
        </NavLink>
        <NavLink to="/prestamos" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <FileText size={20} /> Préstamos
        </NavLink>
        <NavLink to="/usuarios" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <Users size={20} /> Usuarios
        </NavLink>
        <NavLink to="/proveedores" style={({isActive}) => isActive ? activeStyle : navStyle}>
          <Truck size={20} /> Proveedores
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <NavLink to="/login" style={{...navStyle, color: '#ef4444'}}>
          <LogOut size={20} /> Cerrar Sesión
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
