import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Users from './pages/Users';
import Loans from './pages/Loans';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proveedores" element={<Providers />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/prestamos" element={<Loans />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
