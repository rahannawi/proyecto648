// ESTE ARCHIVO SIRVE PARA:
// Definir la interfaz de usuario de "Gestión de Usuarios" (Users).
// Esta vista es de uso exclusivo para el rol de Administrador. Permite listar el personal registrado,
// ver detalles sensibles (como sus contraseñas en claro de demostración) e incorporar nuevos
// usuarios del sistema (colegas, técnicos o administradores) mediante llamados REST a .NET.

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

// ESTA INTERFAZ SIRVE PARA:
// Modelar de forma estricta la estructura de datos de un Usuario.
interface User {
  id: number;
  name: string;
  email: string;
  role: number; // 0 = Admin, 1 = Técnico, 2 = Usuario
  passwordHash?: string; // Contraseña en claro (almacenada temporalmente para fines pedagógicos en la demo)
}

const Users = () => {
  // HOOKS DE ESTADO LOCAL (useState):
  const [users, setUsers] = useState<User[]>([]);                 // Lista de usuarios registrados
  const [loading, setLoading] = useState(true);                   // Indicador de cargando para la UI
  const [showModal, setShowModal] = useState(false);               // Controla el despliegue del modal de registro
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado para el modal de detalles
  const [newUser, setNewUser] = useState({ name: '', email: '', passwordHash: '', role: 0 }); // Datos del formulario

  // ESTA FUNCIÓN SIRVE PARA:
  // Cargar todos los usuarios existentes consumiendo la API de C#.
  const fetchUsers = () => {
    fetch('http://localhost:5219/api/Users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);      // Guarda la lista consultada en el estado
        setLoading(false);    // Apaga el spinner/cargando
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  };

  // Carga inicial al inicializar la pantalla
  useEffect(() => {
    fetchUsers();
  }, []);

  // ESTA FUNCIÓN SIRVE PARA:
  // Controlar el registro de usuarios (ESTA ES LA FUNCIÓN CLAVE QUE PREGUNTARÁ LA PROFESORA).
  // 1. Captura los campos del formulario.
  // 2. Parsea el rol numérico a entero para evitar problemas de tipos de strings al enviar la petición.
  // 3. Envía una petición POST con el body JSON al controlador 'UsersController'.
  // 4. Tras la respuesta exitosa, cierra el modal, limpia los campos e invoca 'fetchUsers()' para actualizar la tabla.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se refresque
    
    fetch('http://localhost:5219/api/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Convertimos el estado local 'newUser' a JSON string y parseamos el rol
      body: JSON.stringify({...newUser, role: parseInt(newUser.role.toString())})
    }).then(res => {
      if(res.ok) {
        setShowModal(false); // Cierra el modal emergente de registro
        // Limpia el formulario y restablece los inputs
        setNewUser({ name: '', email: '', passwordHash: '', role: 0 }); 
        fetchUsers(); // Vuelve a recargar los usuarios desde MariaDB
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
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Gestión de Usuarios</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Administradores y Usuarios del sistema</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Añadir Usuario</button>
        </header>

        {/* Tabla en Glassmorphism de usuarios registrados */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando usuarios...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>NOMBRE</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EMAIL</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ROL</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay usuarios registrados</td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.email}</td>
                      
                      {/* Rol con color adaptativo */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.role === 0 
                            ? 'rgba(59, 130, 246, 0.2)'  // Azul (Admin)
                            : item.role === 1 
                              ? 'rgba(245, 158, 11, 0.2)'  // Naranja (Técnico)
                              : 'rgba(148, 163, 184, 0.2)', // Gris (Usuario)
                          color: item.role === 0 
                            ? '#60a5fa' 
                            : item.role === 1 
                              ? '#fbbf24' 
                              : '#cbd5e1', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.role === 0 ? 'Admin' : item.role === 1 ? 'Técnico' : 'Usuario'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setSelectedUser(item)}>Ver detalle</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL 1: REGISTRO DE NUEVO USUARIO (AÑADIR PERSONAL) */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Usuario</h2>
              <form onSubmit={handleSubmit}>
                <input required className="input-field" placeholder="Nombre completo" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input required type="email" className="input-field" placeholder="Correo Electrónico" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input required type="password" className="input-field" placeholder="Contraseña" value={newUser.passwordHash} onChange={e => setNewUser({...newUser, passwordHash: e.target.value})} />
                
                {/* Selector de Rol */}
                <select className="input-field" value={newUser.role} onChange={e => setNewUser({...newUser, role: parseInt(e.target.value)})}>
                  <option value={2}>Usuario</option>
                  <option value={1}>Técnico</option>
                  <option value={0}>Administrador</option>
                </select>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: VER DETALLES DEL USUARIO Y SU CONTRASEÑA */}
        {selectedUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '450px', backgroundColor: 'var(--bg-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Detalles del Usuario</h2>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => setSelectedUser(null)}>&times;</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-light)' }}>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>ID:</strong> #{selectedUser.id}</div>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Nombre:</strong> {selectedUser.name}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Correo Electrónico:</strong> {selectedUser.email}</div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Rol:</strong>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: selectedUser.role === 0 ? 'rgba(59, 130, 246, 0.2)' : selectedUser.role === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)', 
                    color: selectedUser.role === 0 ? '#60a5fa' : selectedUser.role === 1 ? '#fbbf24' : '#cbd5e1', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginTop: '0.25rem'
                  }}>
                    {selectedUser.role === 0 ? 'Admin' : selectedUser.role === 1 ? 'Técnico' : 'Usuario'}
                  </span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Contraseña:</strong>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#fbbf24', fontWeight: '600' }}>
                    {selectedUser.passwordHash || '—'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn-primary" onClick={() => setSelectedUser(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
