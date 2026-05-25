import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

interface Provider {
  id: number;
  name: string;
}

interface Equipment {
  id: number;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  provider: Provider;
}

const Dashboard = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState({ name: '', brand: '', model: '', serialNumber: '', status: 'Disponible' });

  const fetchEquipments = () => {
    fetch('http://localhost:5219/api/Equipments')
      .then(res => res.json())
      .then(data => {
        setEquipments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching equipments:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5219/api/Equipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEquipment)
    }).then(res => {
      if(res.ok) {
        setShowModal(false);
        setNewEquipment({ name: '', brand: '', model: '', serialNumber: '', status: 'Disponible' });
        fetchEquipments();
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Catálogo de Equipos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Gestión y consulta de inventario</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Registrar Equipo</button>
        </header>

        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando inventario...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EQUIPO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>MARCA / MODELO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>N° SERIE</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ESTADO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>PROVEEDOR</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {equipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay equipos registrados</td>
                  </tr>
                ) : (
                  equipments.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{item.brand} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.model}</span></td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{item.serialNumber}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.status === 'Disponible' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                          color: item.status === 'Disponible' ? '#4ade80' : '#f87171', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{item.provider?.name || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setSelectedEquipment(item)}>Ver detalle</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Crear */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Equipo</h2>
              <form onSubmit={handleSubmit}>
                <input required className="input-field" placeholder="Nombre (Ej: Router, Laptop)" value={newEquipment.name} onChange={e => setNewEquipment({...newEquipment, name: e.target.value})} />
                <input required className="input-field" placeholder="Marca" value={newEquipment.brand} onChange={e => setNewEquipment({...newEquipment, brand: e.target.value})} />
                <input required className="input-field" placeholder="Modelo" value={newEquipment.model} onChange={e => setNewEquipment({...newEquipment, model: e.target.value})} />
                <input required className="input-field" placeholder="Número de Serie" value={newEquipment.serialNumber} onChange={e => setNewEquipment({...newEquipment, serialNumber: e.target.value})} />
                <select className="input-field" value={newEquipment.status} onChange={e => setNewEquipment({...newEquipment, status: e.target.value})}>
                  <option value="" disabled hidden>Selecciona un estado</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En uso">En uso</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalles / Editar */}
        {selectedEquipment && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '500px', backgroundColor: 'var(--bg-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Detalles del Equipo</h2>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => setSelectedEquipment(null)}>&times;</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-light)' }}>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>ID:</strong> #{selectedEquipment.id}</div>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Nombre:</strong> {selectedEquipment.name}</div>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Marca:</strong> {selectedEquipment.brand}</div>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Modelo:</strong> {selectedEquipment.model}</div>
                <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>N° Serie:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedEquipment.serialNumber}</span></div>
                
                {/* Editable Status */}
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estado:</strong>
                  <select 
                    className="input-field" 
                    style={{ padding: '0.25rem', fontSize: '0.875rem' }}
                    value={selectedEquipment.status} 
                    onChange={e => {
                      const updated = { ...selectedEquipment, status: e.target.value };
                      setSelectedEquipment(updated);
                      // Auto-save logic
                      fetch(`http://localhost:5219/api/Equipments/${updated.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updated)
                      }).then(() => fetchEquipments());
                    }}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En uso">En uso</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem' }}>Proveedor:</strong> {selectedEquipment.provider?.name || 'N/A'} {selectedEquipment.provider?.phone ? `(${selectedEquipment.provider.phone})` : ''}</div>
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn-primary" onClick={() => setSelectedEquipment(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
