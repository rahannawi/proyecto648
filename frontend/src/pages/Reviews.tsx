import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Calendar, User as UserIcon } from 'lucide-react';

// Interfaz que define las propiedades que tiene un objeto de tipo Reseña (Review)
interface Review {
  id: number;
  comment: string;
  date: string;
  status: string;
  author: { id: number; name: string };
  equipment?: { id: number; name: string } | null;
}

const Reviews = () => {
  // Hook useAuth para extraer la información del usuario autenticado en la sesión actual
  const { user } = useAuth();
  
  // ESTADOS DE LA VISTA:
  // reviews: Almacena la lista de reseñas traídas de la base de datos
  const [reviews, setReviews] = useState<Review[]>([]);
  // loading: Controla el indicador de pantalla de carga
  const [loading, setLoading] = useState(true);
  // showModal: Controla la visibilidad del modal para escribir una nueva reseña
  const [showModal, setShowModal] = useState(false);
  // newComment: Almacena el texto de la reseña ingresada en el textarea
  const [newComment, setNewComment] = useState('');

  // ESTA FUNCIÓN SIRVE PARA: Consultar todas las reseñas al backend (C#) e introducirlas en
  // el estado 'reviews' ordenadas cronológicamente desde la más reciente hasta la más antigua.
  const fetchReviews = () => {
    fetch('http://localhost:5219/api/Reviews')
      .then(res => res.json())
      .then(data => {
        // Ordena de forma descendente usando la marca de tiempo (getTime) de la fecha
        const sorted = data.sort((a: Review, b: Review) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReviews(sorted);
        setLoading(false); // Apaga la carga
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setLoading(false);
      });
  };

  // ESTA FUNCIÓN SIRVE PARA: Ejecutar la carga de datos al momento exacto en que la página se monta.
  useEffect(() => {
    fetchReviews();
  }, []);

  // ESTA FUNCIÓN SIRVE PARA: Registrar una nueva reseña en la base de datos enviando un POST
  // al endpoint de Reviews de la API. Asocia el id del usuario logueado en la propiedad 'authorId'
  // y establece 'equipmentId' en null ya que representa una opinión general de la empresa.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita recargar el navegador
    if (!user) return;

    fetch('http://localhost:5219/api/Reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: newComment,
        status: 'Pendiente',
        authorId: user.id, // ID del autor autenticado
        equipmentId: null // Se envía nulo indicando reseña general de la empresa
      })
    }).then(res => {
      if (res.ok) {
        setShowModal(false); // Cierra el modal
        setNewComment(''); // Limpia el campo de texto
        fetchReviews(); // Recarga la lista de reseñas para mostrar la nueva opinión
      }
    });
  };

  // ESTA CONDICIÓN SIRVE PARA: Restringir que ÚNICAMENTE los Usuarios generales (role === 2) puedan crear reseñas.
  // Si el usuario es Admin (role: 0) o Técnico (role: 1), esta variable será falsa y se les ocultará el botón de registro.
  const canCreateReview = user && user.role === 2;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Pinta la barra de navegación lateral izquierda */}
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', position: 'relative' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Reseñas de la Empresa</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Opiniones, comentarios y críticas constructivas sobre la organización</p>
          </div>
          {/* Muestra el botón de "+ Nueva Reseña" solo si se cumple la condición canCreateReview (Usuario) */}
          {canCreateReview && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nueva Reseña</button>
          )}
        </header>

        {/* CONTENEDOR DE TARJETAS (GRID DE RESEÑAS) */}
        <div className="animate-fade-in">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando reseñas...</div>
          ) : reviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: 'var(--primary-color)' }} />
              <h3>No hay reseñas registradas aún</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Sé el primero en dejar tu reseña sobre la empresa.</p>
            </div>
          ) : (
            // Grid responsivo de tarjetas usando flex/grid
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {reviews.map((item) => (
                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--primary-color)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <UserIcon size={16} />
                        <span style={{ fontWeight: '600', color: 'var(--text-light)' }}>{item.author?.name || 'Anónimo'}</span>
                      </div>
                    </div>
                    {/* Imprime el comentario de la reseña en cursiva y entre comillas */}
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.5', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      "{item.comment}"
                    </p>
                  </div>
                  {/* Muestra la fecha y hora de creación de la opinión */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL PARA REDACTAR UNA NUEVA RESEÑA */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '450px', backgroundColor: 'var(--bg-dark)' }}>
              <h2 style={{ marginBottom: '1rem' }}>Escribe tu Reseña</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Comparte tus comentarios, sugerencias o críticas constructivas sobre la empresa.</p>
              <form onSubmit={handleSubmit}>
                {/* Cuadro de texto amplio (textarea) para redactar el comentario */}
                <textarea 
                  required 
                  className="input-field" 
                  rows={5} 
                  placeholder="Escribe tu comentario aquí..." 
                  style={{ resize: 'none', fontFamily: 'inherit', padding: '0.75rem' }} 
                  value={newComment} 
                  onChange={e => setNewComment(e.target.value)} 
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Enviar Reseña</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reviews;
