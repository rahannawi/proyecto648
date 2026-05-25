import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

interface Loan {
  id: number;
  equipment: { id: number, name: string, serialNumber: string };
  borrower: { id: number, name: string };
  startDate: string;
  endDate: string;
  status: string;
}

const Loans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLoan, setNewLoan] = useState({ equipmentId: '', borrowerId: '', approverId: '', startDate: new Date().toISOString().split('T')[0], status: 'Activo' });

  const fetchData = () => {
    Promise.all([
      fetch('http://localhost:5219/api/Loans').then(res => res.json()),
      fetch('http://localhost:5219/api/Equipments').then(res => res.json()),
      fetch('http://localhost:5219/api/Users').then(res => res.json())
    ]).then(([loansData, equipmentsData, usersData]) => {
      setLoans(loansData);
      setEquipments(equipmentsData);
      setUsers(usersData);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5219/api/Loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newLoan,
        equipmentId: parseInt(newLoan.equipmentId),
        borrowerId: parseInt(newLoan.borrowerId),
        approverId: parseInt(newLoan.approverId),
        startDate: new Date(newLoan.startDate).toISOString()
      })
    }).then(res => {
      if(res.ok) {
        setShowModal(false);
        setNewLoan({ equipmentId: '', borrowerId: '', approverId: '', startDate: new Date().toISOString().split('T')[0], status: 'Activo' });
        fetchData();
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Préstamos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Registro de asignaciones de equipos</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Préstamo</button>
        </header>

        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando préstamos...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EQUIPO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ASIGNADO A</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>FECHA INICIO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay préstamos activos</td>
                  </tr>
                ) : (
                  loans.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.equipment?.name} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.equipment?.serialNumber}</span></td>
                      <td style={{ padding: '1rem' }}>{item.borrower?.name}</td>
                      <td style={{ padding: '1rem' }}>{new Date(item.startDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.status === 'Activo' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)', 
                          color: item.status === 'Activo' ? '#60a5fa' : '#cbd5e1', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Nuevo Préstamo */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Préstamo</h2>
              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Equipo a prestar</label>
                <select required className="input-field" value={newLoan.equipmentId} onChange={e => setNewLoan({...newLoan, equipmentId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona un equipo</option>
                  {equipments.filter(eq => eq.status === 'Disponible').map(eq => <option key={eq.id} value={eq.id}>{eq.name} - {eq.serialNumber}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Asignar a Usuario</label>
                <select required className="input-field" value={newLoan.borrowerId} onChange={e => setNewLoan({...newLoan, borrowerId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona quién recibe</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Aprobado por</label>
                <select required className="input-field" value={newLoan.approverId} onChange={e => setNewLoan({...newLoan, approverId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona el aprobador</option>
                  {users.filter(u => u.role === 0).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fecha de Inicio</label>
                <input required type="date" className="input-field" value={newLoan.startDate} onChange={e => setNewLoan({...newLoan, startDate: e.target.value})} />

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

export default Loans;
