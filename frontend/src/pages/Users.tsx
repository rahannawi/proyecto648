import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', passwordHash: 'default123', role: 0 });

  const fetchUsers = () => {
    fetch('http://localhost:5219/api/Users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5219/api/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...newUser, role: parseInt(newUser.role.toString())})
    }).then(res => {
      if(res.ok) {
        setShowModal(false);
        setNewUser({ name: '', email: '', passwordHash: 'default123', role: 0 });
        fetchUsers();
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Gestión de Usuarios</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Administradores y Operadores del sistema</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Añadir Usuario</button>
        </header>

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
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay usuarios registrados</td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.role === 0 ? 'rgba(59, 130, 246, 0.2)' : item.role === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)', 
                          color: item.role === 0 ? '#60a5fa' : item.role === 1 ? '#fbbf24' : '#cbd5e1', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.role === 0 ? 'Admin' : item.role === 1 ? 'Técnico' : 'Operador'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Usuario</h2>
              <form onSubmit={handleSubmit}>
                <input required className="input-field" placeholder="Nombre completo" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input required type="email" className="input-field" placeholder="Correo Electrónico" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <select className="input-field" value={newUser.role} onChange={e => setNewUser({...newUser, role: parseInt(e.target.value)})}>
                  <option value={2}>Operador</option>
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
      </main>
    </div>
  );
};

export default Users;
