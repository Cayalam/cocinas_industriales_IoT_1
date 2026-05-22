import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SelectorDispositivo from './pages/SelectorDispositivo';
import DashboardPage from './pages/DashboardPage';
import HistorialPage from './pages/HistorialPage';
import AlertasPage from './pages/AlertasPage';
import AnalisisPage from './pages/AnalisisPage';

// Ruta protegida: redirige a login si no hay sesión
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div style={{ minHeight: '100vh', background: '#0d111d' }} />;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

// Layout con sidebar (solo en rutas de dispositivo)
function LayoutConSidebar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <RutaProtegida><SelectorDispositivo /></RutaProtegida>
      } />

      <Route path="/dispositivo/:dispositivoId" element={
        <RutaProtegida>
          <LayoutConSidebar><DashboardPage /></LayoutConSidebar>
        </RutaProtegida>
      } />

      <Route path="/dispositivo/:dispositivoId/historial" element={
        <RutaProtegida>
          <LayoutConSidebar><HistorialPage /></LayoutConSidebar>
        </RutaProtegida>
      } />

      <Route path="/dispositivo/:dispositivoId/alertas" element={
        <RutaProtegida>
          <LayoutConSidebar><AlertasPage /></LayoutConSidebar>
        </RutaProtegida>
      } />

      <Route path="/dispositivo/:dispositivoId/analisis" element={
        <RutaProtegida>
          <LayoutConSidebar><AnalisisPage /></LayoutConSidebar>
        </RutaProtegida>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
