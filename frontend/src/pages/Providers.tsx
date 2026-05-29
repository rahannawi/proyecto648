// ESTE ARCHIVO SIRVE PARA:
// Definir la interfaz de usuario de "Proveedores" (Providers).
// Muestra una lista elegante de todas las empresas aliadas y permite al Administrador
// añadir nuevos proveedores a la base de datos MariaDB consumiendo el controlador de C#.

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

// ESTA INTERFAZ SIRVE PARA:
// Definir el modelo estricto de TypeScript para representar un Proveedor.
interface Provider {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
}

const Providers = () => {
  // Obtenemos los datos del usuario para aplicar restricciones de visualización de botones
  const { user } = useAuth();

  // HOOKS DE ESTADO LOCAL (useState):
  const [providers, setProviders] = useState<Provider[]>([]); // Lista de proveedores consultados
  const [loading, setLoading] = useState(true);                 // Estado de carga de la API
  const [showModal, setShowModal] = useState(false);             // Muestra/oculta ventana emergente de registro
  const [newProvider, setNewProvider] = useState({ name: '', contactName: '', phone: '', email: '' }); // Estado del formulario

  // ESTA FUNCIÓN SIRVE PARA:
  // Consultar la API REST de .NET en /api/Providers para obtener la lista de proveedores.
  const fetchProviders = () => {
    fetch('http://localhost:5219/api/Providers')
      .then(res => res.json())
      .then(data => {
        setProviders(data); // Guarda los datos consultados
        setLoading(false);  // Detiene el estado de cargando
      })
      .catch(err => {
        console.error('Error fetching providers:', err);
        setLoading(false);
      });
  };

  // Se ejecuta al cargar por primera vez la página
  useEffect(() => {
    fetchProviders();
  }, []);

  // ESTA FUNCIÓN SIRVE PARA:
  // Controlar el submit del formulario para guardar un nuevo proveedor corporativo.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene la recarga del navegador
    
    fetch('http://localhost:5219/api/Providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProvider) // Convertimos el objeto local a JSON string
    }).then(res => {
      if(res.ok) {
        setShowModal(false); // Cierra la ventana emergente modal
        setNewProvider({ name: '', contactName: '', phone: '', email: '' }); // Limpia el formulario
        fetchProviders(); // Refresca la tabla en pantalla
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        
        {/* Encabezado */}
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Directorio de Proveedores</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Gestión de contactos corporativos</p>
          </div>
          {/* Lógica de Rol: Solo el Administrador (role === 0) puede registrar nuevos proveedores */}
          {user && user.role === 0 && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Añadir Proveedor</button>
          )}
        </header>

        {/* Tabla en formato Glassmorphism */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando proveedores...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EMPRESA</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>CONTACTO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>TELÉFONO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay proveedores registrados</td>
                  </tr>
                ) : (
                  providers.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.contactName}</td>
                      <td style={{ padding: '1rem' }}>{item.phone}</td>
                      <td style={{ padding: '1rem' }}>{item.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL: REGISTRO DE NUEVO PROVEEDOR */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Proveedor</h2>
              <form onSubmit={handleSubmit}>
                <input required className="input-field" placeholder="Empresa" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} />
                <input required className="input-field" placeholder="Nombre de Contacto" value={newProvider.contactName} onChange={e => setNewProvider({...newProvider, contactName: e.target.value})} />
                <input required className="input-field" placeholder="Teléfono" value={newProvider.phone} onChange={e => setNewProvider({...newProvider, phone: e.target.value})} />
                <input required type="email" className="input-field" placeholder="Correo Electrónico" value={newProvider.email} onChange={e => setNewProvider({...newProvider, email: e.target.value})} />
                
                {/* Botones */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Providers;
