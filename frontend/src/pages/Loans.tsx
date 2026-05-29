import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

// Interfaz que define las propiedades que tiene un objeto de tipo Préstamo
interface Loan {
  id: number;
  equipment: { id: number, name: string, serialNumber: string };
  borrower: { id: number, name: string };
  approver?: { id: number, name: string };
  startDate: string;
  endDate?: string | null;
  status: string;
}

const Loans = () => {
  // hook useAuth para obtener los datos del usuario logueado en la sesión actual
  const { user } = useAuth();
  
  // ESTADOS DE LA VISTA:
  // loans: Guarda la lista de préstamos que se pintará en la tabla
  const [loans, setLoans] = useState<Loan[]>([]);
  // equipments: Almacena los equipos registrados en el sistema para listarlos en el selector
  const [equipments, setEquipments] = useState<any[]>([]);
  // users: Almacena los usuarios para poder elegir a quién se le asigna el préstamo
  const [users, setUsers] = useState<any[]>([]);
  // loading: Estado de carga (pantalla de cargando)
  const [loading, setLoading] = useState(true);
  // showModal: Controla la visibilidad del modal para crear un préstamo
  const [showModal, setShowModal] = useState(false);
  // newLoan: Estado que almacena temporalmente los datos del nuevo préstamo a enviar
  const [newLoan, setNewLoan] = useState({ equipmentId: '', borrowerId: '', approverId: '', startDate: new Date().toISOString().split('T')[0], status: 'Activo' });

  // ESTA FUNCIÓN SIRVE PARA: Abrir el modal y pre-configurar los valores del formulario.
  // Coloca al Técnico logueado como aprobador automático en el formulario mediante su ID.
  const handleOpenModal = () => {
    setNewLoan({
      equipmentId: '',
      borrowerId: '',
      approverId: user ? user.id.toString() : '', // Asigna el id del Técnico logueado por defecto
      startDate: new Date().toISOString().split('T')[0], // Coloca la fecha actual de hoy
      status: 'Activo'
    });
    setShowModal(true); // Muestra el modal en pantalla
  };

  // ESTA FUNCIÓN SIRVE PARA: Traer toda la información necesaria (Préstamos, Equipos y Usuarios)
  // mediante peticiones simultáneas (Promise.all) al backend en C# y guardarlas en los estados.
  const fetchData = () => {
    Promise.all([
      fetch('http://localhost:5219/api/Loans').then(res => res.json()),
      fetch('http://localhost:5219/api/Equipments').then(res => res.json()),
      fetch('http://localhost:5219/api/Users').then(res => res.json())
    ]).then(([loansData, equipmentsData, usersData]) => {
      setLoans(loansData);
      setEquipments(equipmentsData);
      setUsers(usersData);
      setLoading(false); // Quita el indicador de carga
    }).catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  };

  // ESTA FUNCIÓN SIRVE PARA: Ejecutar código automáticamente cuando la página se monta por primera vez.
  // En este caso, ejecuta 'fetchData' para cargar las tablas de inmediato.
  useEffect(() => {
    fetchData();
  }, []);

  // ESTA FUNCIÓN SIRVE PARA: Registrar un nuevo préstamo en la base de datos al enviar el formulario modal.
  // 1. Envía un POST al endpoint de Loans del backend de C#.
  // 2. Si tiene éxito, actualiza automáticamente el estado del Equipo seleccionado a "En uso"
  //    mediante un PUT, garantizando que ya no esté disponible para otros préstamos.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue automáticamente

    // Petición POST para guardar el préstamo en el servidor
    fetch('http://localhost:5219/api/Loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipmentId: parseInt(newLoan.equipmentId),
        borrowerId: parseInt(newLoan.borrowerId),
        approverId: parseInt(newLoan.approverId),
        startDate: new Date(newLoan.startDate).toISOString(),
        status: 'Activo'
      })
    }).then(res => {
      if(res.ok) {
        // Busca el equipo seleccionado en la lista local
        const selectedEq = equipments.find(eq => eq.id === parseInt(newLoan.equipmentId));
        if (selectedEq) {
          // Petición PUT para actualizar el estado del equipo a "En uso"
          const updatedEq = { ...selectedEq, status: 'En uso' };
          fetch(`http://localhost:5219/api/Equipments/${selectedEq.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEq)
          }).then(() => {
            setShowModal(false); // Cierra el modal
            setNewLoan({ equipmentId: '', borrowerId: '', approverId: '', startDate: new Date().toISOString().split('T')[0], status: 'Activo' });
            fetchData(); // Recarga la tabla de préstamos actualizada
          });
        } else {
          setShowModal(false);
          setNewLoan({ equipmentId: '', borrowerId: '', approverId: '', startDate: new Date().toISOString().split('T')[0], status: 'Activo' });
          fetchData();
        }
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Pinta la barra de navegación lateral izquierda */}
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Préstamos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Registro de asignaciones de equipos</p>
          </div>
          {/* ESTA VALIDACIÓN SIRVE PARA: Mostrar el botón de "+ Nuevo Préstamo" ÚNICAMENTE si el usuario es un Técnico (role === 1) */}
          {user && user.role === 1 && (
            <button className="btn-primary" onClick={handleOpenModal}>+ Nuevo Préstamo</button>
          )}
        </header>

        {/* CONTENEDOR DE LA TABLA DE PRÉSTAMOS */}
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando préstamos...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>EQUIPO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ASIGNADO A</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>APROBADO POR</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>FECHA INICIO</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>FECHA DEVOLUCIÓN</th>
                  <th style={{ padding: '1rem', fontWeight: '500' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay préstamos activos</td>
                  </tr>
                ) : (
                  // Mapea la lista de préstamos traída de la base de datos para renderizar cada fila
                  loans.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{item.equipment?.name} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.equipment?.serialNumber}</span></td>
                      <td style={{ padding: '1rem' }}>{item.borrower?.name}</td>
                      <td style={{ padding: '1rem' }}>{item.approver?.name || '—'}</td>
                      <td style={{ padding: '1rem' }}>{new Date(item.startDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{item.endDate ? new Date(item.endDate).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '1rem' }}>
                        {/* Inserta una insignia con colores personalizados según el estado del préstamo */}
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.status === 'Activo' 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : item.status === 'Devuelto' 
                              ? 'rgba(34, 197, 94, 0.2)' 
                              : item.status === 'Devuelto por Mantenimiento'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(148, 163, 184, 0.2)', 
                          color: item.status === 'Activo' 
                            ? '#60a5fa' 
                            : item.status === 'Devuelto' 
                              ? '#4ade80' 
                              : item.status === 'Devuelto por Mantenimiento'
                                ? '#f87171'
                                : '#cbd5e1', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
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

        {/* MODAL REGISTRO NUEVO PRÉSTAMO */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Préstamo</h2>
              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Equipo a prestar
                </label>
                {/* Selector de equipos filtrando únicamente los que están Disponibles */}
                <select required className="input-field" value={newLoan.equipmentId} onChange={e => setNewLoan({...newLoan, equipmentId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona un equipo</option>
                  {equipments.filter(eq => eq.status === 'Disponible').map(eq => <option key={eq.id} value={eq.id}>{eq.name} - {eq.serialNumber}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Asignar a Usuario</label>
                {/* Selector de usuarios receptores del préstamo */}
                <select required className="input-field" value={newLoan.borrowerId} onChange={e => setNewLoan({...newLoan, borrowerId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona quién recibe</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Aprobado por
                </label>
                {/* ESTE INPUT SIRVE PARA: Mostrar directamente el nombre del Técnico logueado de forma bloqueada */}
                <input required type="text" className="input-field" style={{ opacity: 0.8, cursor: 'not-allowed' }} value={user?.name || ''} disabled />

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
