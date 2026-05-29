// ESTE ARCHIVO SIRVE PARA:
// Proveer un contexto global de autenticación (AuthContext) utilizando la Context API de React.
// Esto permite centralizar y compartir la información del usuario que inició sesión (nombre, email, rol)
// y los métodos para iniciar y cerrar sesión con todos los componentes del sistema, evitando tener que pasar
// datos manualmente de componente en componente (prop drilling).

import React, { createContext, useContext, useState, useEffect } from 'react';

// ESTA INTERFAZ SIRVE PARA:
// Definir la estructura estricta del objeto de usuario que maneja el frontend.
export interface User {
  id: number;
  name: string;
  email: string;
  role: number; // 0 = Admin, 1 = Técnico, 2 = Usuario
}

// ESTA INTERFAZ SIRVE PARA:
// Definir la forma o el contrato del contexto (los datos y funciones expuestas globalmente).
interface AuthContextType {
  user: User | null;                // Contiene el usuario logueado o null si no hay sesión
  login: (userData: User) => void;   // Función para establecer la sesión tras autenticarse
  logout: () => void;                // Función para destruir la sesión y salir del sistema
  isAuthenticated: boolean;          // Booleano directo que indica si hay una sesión activa
}

// Creamos el contexto con un valor inicial nulo.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ESTE COMPONENTE (AuthProvider) SIRVE PARA:
// Envolver la aplicación y proveer el estado real de autenticación.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado local que guarda los datos del usuario logueado en memoria de React.
  const [user, setUser] = useState<User | null>(null);

  // EFECTO DE PERSISTENCIA (useEffect):
  // Se ejecuta una sola vez cuando el componente se monta por primera vez.
  useEffect(() => {
    // Comprobamos si hay un usuario previamente guardado en el localStorage del navegador.
    // Esto evita que el usuario pierda su sesión al presionar F5 o recargar la página.
    const storedUser = localStorage.getItem('netinventory_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Reconstruimos el JSON guardado en string a un objeto
    }
  }, []);

  // ESTA FUNCIÓN SIRVE PARA:
  // Registrar el inicio de sesión exitoso. Se llama desde la vista de Login tras validar con la base de datos.
  const login = (userData: User) => {
    setUser(userData); // Guarda al usuario en el estado de React para actualizar la UI en tiempo real
    localStorage.setItem('netinventory_user', JSON.stringify(userData)); // Guarda en almacenamiento persistente
  };

  // ESTA FUNCIÓN SIRVE PARA:
  // Cerrar la sesión del usuario de forma inmediata.
  const logout = () => {
    setUser(null); // Limpia el estado de la UI
    localStorage.removeItem('netinventory_user'); // Remueve los datos guardados del navegador
  };

  return (
    // Inyectamos las variables y funciones en el proveedor para que estén disponibles
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// ESTE HOOK PERSONALIZADO (useAuth) SIRVE PARA:
// Facilitar a cualquier componente secundario el acceso directo a los datos del usuario o funciones de login/logout.
// En lugar de importar useContext(AuthContext) en cada vista, simplemente importan y usan useAuth().
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

