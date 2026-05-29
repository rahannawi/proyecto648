// ESTE ARCHIVO SIRVE PARA:
// Definir la vista de "Inicio de Sesión" (Login) de la aplicación.
// Es la puerta de entrada de seguridad del cliente. Permite capturar las credenciales
// del usuario (email y contraseña), realizar una solicitud POST a la API REST de C#
// para autenticarse, y guardar el token/objeto de usuario en la sesión global en caso de éxito.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Lock, Mail } from 'lucide-react'; // Iconos visuales premium
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  // HOOKS DE ESTADO LOCAL (useState):
  // Rastrean el estado de los inputs y controlan el comportamiento de carga de la pantalla
  const [email, setEmail] = useState('');         // Almacena el correo electrónico tipeado
  const [password, setPassword] = useState('');   // Almacena la contraseña tipeada
  const [error, setError] = useState('');         // Almacena y despliega mensajes de error si falla la autenticación
  const [isLoading, setIsLoading] = useState(false); // Bandera para deshabilitar botones mientras se procesa la petición

  // Hook para redireccionar de forma dinámica entre páginas web
  const navigate = useNavigate();
  
  // Obtenemos la función de login global del AuthContext
  const { login } = useAuth();

  // ESTA FUNCIÓN SIRVE PARA:
  // Controlar el envío del formulario de inicio de sesión.
  // Envía las credenciales estructuradas al backend y redirige al dashboard si las credenciales son válidas.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue completamente
    setError('');       // Resetea errores previos
    setIsLoading(true); // Activa el estado de carga (bloquea botones)

    try {
      // 1. Petición POST asíncrona hacia el endpoint de inicio de sesión de nuestro servidor .NET
      const response = await fetch('http://localhost:5219/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // Convertimos las variables a un string JSON
      });

      // 2. Si la API de C# responde con un código de estado que no es exitoso (ej. 401 Unauthorized o 400 Bad Request)
      if (!response.ok) {
        throw new Error('Credenciales incorrectas'); // Lanza una excepción
      }

      // 3. Obtenemos el objeto de usuario devuelto por la API (con su id, name, email y role)
      const userData = await response.json();
      
      // 4. Invocamos la función del contexto global para almacenar la sesión de forma persistente
      login(userData);
      
      // 5. Redirigimos al usuario inmediatamente hacia el Dashboard de inventario
      navigate('/dashboard');
    } catch (err) {
      // Si ocurre un error de red o credenciales incorrectas, capturamos el fallo y desplegamos alerta
      setError('Credenciales incorrectas o servidor inactivo');
    } finally {
      // Apagamos el estado de carga al terminar el proceso de login
      setIsLoading(false);
    }
  };

  return (
    // Contenedor principal centrado con fondo oscuro y flexbox
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Tarjeta de Login en diseño premium Glassmorphism */}
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '420px' }}>
        
        {/* Cabecera del formulario: logotipo e información */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-color)', borderRadius: '16px', marginBottom: '1rem' }}>
            <Server size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }}>Net-Inventory</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Ingresa al sistema de administración
          </p>
        </div>

        {/* Sección de visualización de errores (si existen) */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Formulario interactivo */}
        <form onSubmit={handleLogin}>
          
          {/* Input para el correo electrónico */}
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Vincula el input al estado de React
              required
            />
          </div>
          
          {/* Input para la contraseña */}
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Vincula el input al estado de React
              required
            />
          </div>

          {/* Botón de envío que se desactiva y cambia su texto al estar cargando la petición */}
          <button type="submit" className="btn-primary" style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
