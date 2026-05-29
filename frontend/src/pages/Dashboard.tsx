// ESTE ARCHIVO SIRVE PARA:
// Desplegar e interactuar con la vista de "Catálogo de Equipos" (Dashboard principal).
// Es la página medular del sistema, donde se visualiza el inventario físico en tiempo real.
// Cuenta con funciones para cargar datos de la API de C# mediante AJAX (fetch),
// registrar nuevos equipos físicos asociando un proveedor y cambiar el estado del equipo
// con impacto automatizado en los préstamos activos (cierre automático al devolver).

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

// ESTA INTERFAZ SIRVE PARA:
// Definir la estructura estricta de los datos de un Proveedor requerida dentro de esta vista.
interface Provider {
  id: number;
  name: string;
  phone?: string;
}

// ESTA INTERFAZ SIRVE PARA:
// Definir la estructura estricta de un Equipo (Equipment), incluyendo el objeto completo del Proveedor asociado.
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
  // Obtenemos los datos del usuario logueado desde el contexto global de autenticación
  const { user } = useAuth();
  
  // HOOKS DE ESTADO (useState):
  // Permiten a React rastrear datos en memoria de la UI y re-renderizar la pantalla de forma automática al cambiar.
  const [equipments, setEquipments] = useState<Equipment[]>([]); // Lista de equipos obtenidos de la API
  const [loading, setLoading] = useState(true);                  // Indicador de cargando para mostrar spinners/textos de carga
  const [showModal, setShowModal] = useState(false);              // Controla si el modal de registro está abierto o cerrado
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null); // Equipo seleccionado para editar o ver detalles
  const [newEquipment, setNewEquipment] = useState({ name: '', brand: '', model: '', serialNumber: '', status: 'Disponible', providerId: '' }); // Datos del formulario de registro
  const [providers, setProviders] = useState<Provider[]>([]);    // Lista de proveedores disponibles para el selector

  // ESTA FUNCIÓN SIRVE PARA:
  // Consultar la API REST de C# y obtener todos los equipos del inventario.
  const fetchEquipments = () => {
    fetch('http://localhost:5219/api/Equipments')
      .then(res => res.json()) // Convierte la respuesta HTTP en un objeto JavaScript
      .then(data => {
        setEquipments(data);   // Guarda los datos en el estado local de React
        setLoading(false);      // Apaga el indicador de carga
      })
      .catch(err => {
        console.error('Error fetching equipments:', err);
        setLoading(false);
      });
  };

  // ESTA FUNCIÓN SIRVE PARA:
  // Consultar la API de proveedores para poblar el selector desplegable en el formulario de registro de equipos.
  const fetchProviders = () => {
    fetch('http://localhost:5219/api/Providers')
      .then(res => res.json())
      .then(data => {
        setProviders(data); // Guarda los proveedores en el estado local
      })
      .catch(err => {
        console.error('Error fetching providers:', err);
      });
  };

  // HOOK DE EFECTO (useEffect):
  // Se dispara de manera automática una sola vez cuando la página se carga (se monta).
  // Es ideal para desencadenar solicitudes iniciales de red y APIs REST.
  useEffect(() => {
    fetchEquipments();
    fetchProviders();
  }, []);

  // ESTA FUNCIÓN SIRVE PARA:
  // Controlar el envío (submit) del formulario para registrar un nuevo equipo.
  // Solo los administradores (user.role === 0) tienen acceso a este botón e interfaz.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Detiene la recarga del navegador por defecto al enviar el formulario
    
    fetch('http://localhost:5219/api/Equipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Construimos el cuerpo JSON y nos aseguramos de parsear el 'providerId' a entero
      // ya que los formularios HTML manejan strings por defecto, mientras que C# y la base de datos esperan enteros.
      body: JSON.stringify({
        name: newEquipment.name,
        brand: newEquipment.brand,
        model: newEquipment.model,
        serialNumber: newEquipment.serialNumber,
        status: newEquipment.status,
        providerId: newEquipment.providerId ? parseInt(newEquipment.providerId) : null
      })
    }).then(res => {
      if(res.ok) {
        setShowModal(false); // Cierra la ventana emergente tras guardar
        // Resetea todos los campos del formulario a sus valores por defecto
        setNewEquipment({ name: '', brand: '', model: '', serialNumber: '', status: 'Disponible', providerId: '' });
        fetchEquipments(); // Recarga la tabla de equipos para mostrar el registro recién guardado
      }
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra de Navegación Lateral */}
      <Sidebar />
      
      {/* Área de Contenido Principal */}
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        
        {/* Encabezado de la página */}
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Catálogo de Equipos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Gestión y consulta de inventario</p>
          </div>
          {/* Lógica condicional de rol: solo el Administrador (role === 0) puede registrar equipos físicos */}
          {user && user.role === 0 && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Registrar Equipo</button>
          )}
        </header>

        {/* Panel del Inventario en formato Glassmorphism */}
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
                      {/* Información del equipo */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{item.brand} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.model}</span></td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{item.serialNumber}</td>
                      
                      {/* Estado físico con color adaptativo premium */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: item.status === 'Disponible' 
                            ? 'rgba(34, 197, 94, 0.2)' // Verde traslúcido
                            : item.status === 'En uso' 
                              ? 'rgba(59, 130, 246, 0.2)' // Azul traslúcido
                              : 'rgba(239, 68, 68, 0.2)', // Rojo traslúcido
                          color: item.status === 'Disponible' 
                            ? '#4ade80' 
                            : item.status === 'En uso' 
                              ? '#60a5fa' 
                              : '#f87171', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{item.provider?.name || 'N/A'}</td>
                      
                      {/* Botón de acciones para ver el modal de detalles */}
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

        {/* MODAL 1: REGISTRO DE NUEVOS EQUIPOS */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Nuevo Equipo</h2>
              <form onSubmit={handleSubmit}>
                <input required className="input-field" placeholder="Nombre (Ej: Router, Laptop)" value={newEquipment.name} onChange={e => setNewEquipment({...newEquipment, name: e.target.value})} />
                <input required className="input-field" placeholder="Marca" value={newEquipment.brand} onChange={e => setNewEquipment({...newEquipment, brand: e.target.value})} />
                <input required className="input-field" placeholder="Modelo" value={newEquipment.model} onChange={e => setNewEquipment({...newEquipment, model: e.target.value})} />
                <input required className="input-field" placeholder="Número de Serie" value={newEquipment.serialNumber} onChange={e => setNewEquipment({...newEquipment, serialNumber: e.target.value})} />
                
                {/* Selector de estado inicial */}
                <select className="input-field" value={newEquipment.status} onChange={e => setNewEquipment({...newEquipment, status: e.target.value})}>
                  <option value="" disabled hidden>Selecciona un estado</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
                
                {/* Selector de Proveedor relacional */}
                <select required className="input-field" value={newEquipment.providerId} onChange={e => setNewEquipment({...newEquipment, providerId: e.target.value})}>
                  <option value="" disabled hidden>Selecciona un proveedor</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                
                {/* Botones de acción */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: DETALLES DEL EQUIPO Y CAMBIO DE ESTADO FÍSICO */}
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
                
                {/* LÓGICA DE ACTUALIZACIÓN DE ESTADOS FÍSICOS CON CIERRE AUTOMÁTICO DE PRÉSTAMOS */}
                <div>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estado:</strong>
                  
                  {/* RESTRICCIÓN DE PRIVILEGIOS DE ROL:
                      Solo el Técnico (role === 1) tiene el selector para modificar el estado del equipo.
                      El Administrador (0) y Usuario común (2) solo pueden ver la etiqueta estática de lectura. */}
                  {user && user.role !== 1 ? (
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: selectedEquipment.status === 'Disponible' 
                        ? 'rgba(34, 197, 94, 0.2)' 
                        : selectedEquipment.status === 'En uso' 
                          ? 'rgba(59, 130, 246, 0.2)' 
                          : 'rgba(239, 68, 68, 0.2)', 
                      color: selectedEquipment.status === 'Disponible' 
                        ? '#4ade80' 
                        : selectedEquipment.status === 'En uso' 
                          ? '#60a5fa' 
                          : '#f87171', 
                      borderRadius: '999px', 
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginTop: '0.25rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {selectedEquipment.status}
                    </span>
                  ) : (
                    // Selector interactivo exclusivo para el rol de Técnico:
                    <select 
                      className="input-field" 
                      style={{ padding: '0.25rem', fontSize: '0.875rem' }}
                      value={selectedEquipment.status} 
                      
                      // EXPLICACIÓN DEL TRIGGER PARA LA DEFENSA:
                      // Si el equipo estaba "En uso" (prestado) y el técnico cambia su estado físico a "Disponible" o "Mantenimiento":
                      // 1. El frontend consulta todos los préstamos de la API.
                      // 2. Encuentra el préstamo que esté actualmente "Activo" para este equipo.
                      // 3. Envía una petición PUT para actualizar ese préstamo a "Devuelto" (o "Devuelto por Mantenimiento")
                      //    estableciendo la fecha de fin (endDate) en este mismo instante de forma automatizada.
                      // 4. Guarda la actualización del estado físico en la tabla de Equipos.
                      onChange={e => {
                        const newStatus = e.target.value;
                        const updated = { ...selectedEquipment, status: newStatus };
                        setSelectedEquipment(updated); // Actualiza la UI del modal localmente
                        
                        const wasInUse = selectedEquipment.status === 'En uso';
                        const isReturning = newStatus === 'Disponible' || newStatus === 'Mantenimiento';
                        
                        if (wasInUse && isReturning) {
                          // 1. Obtener listado de préstamos
                          fetch('http://localhost:5219/api/Loans')
                            .then(res => res.json())
                            .then(loans => {
                              // 2. Ubicar el préstamo activo del equipo
                              const activeLoan = loans.find((l: any) => l.equipmentId === updated.id && l.status === 'Activo');
                              if (activeLoan) {
                                // Determinar nuevo estado del préstamo según destino del hardware
                                const targetLoanStatus = newStatus === 'Mantenimiento' ? 'Devuelto por Mantenimiento' : 'Devuelto';
                                
                                // Construir el objeto de préstamo actualizado con el fin de la fecha actual
                                const updatedLoan = {
                                  id: activeLoan.id,
                                  startDate: activeLoan.startDate,
                                  endDate: new Date().toISOString(), // Fecha y hora actuales
                                  status: targetLoanStatus,
                                  equipmentId: activeLoan.equipmentId,
                                  borrowerId: activeLoan.borrowerId,
                                  approverId: activeLoan.approverId,
                                  equipment: null, // EF exige enviar navegación en nulo
                                  borrower: null,
                                  approver: null
                                };
                                
                                // 3. Petición PUT para guardar el cierre del préstamo
                                fetch(`http://localhost:5219/api/Loans/${activeLoan.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(updatedLoan)
                                });
                              }
                            });
                        }

                        // 4. Petición PUT para actualizar el estado físico del equipo en la API
                        fetch(`http://localhost:5219/api/Equipments/${updated.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updated)
                        }).then(() => fetchEquipments()); // Refresca el inventario de fondo
                      }}
                    >
                      <option value="Disponible">Disponible</option>
                      {/* Si ya estaba prestado, permitimos mantener la opción de En uso */}
                      {selectedEquipment.status === 'En uso' && (
                        <option value="En uso">En uso</option>
                      )}
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  )}
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
