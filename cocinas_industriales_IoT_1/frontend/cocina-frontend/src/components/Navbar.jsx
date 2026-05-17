import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { dispositivoId } = useParams();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const base = `/dispositivo/${dispositivoId}`;

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-title">Cocinas Industriales UIS</div>
        <div className="brand-subtitle">Sector A · Industrial</div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to={base} end className={({ isActive }) => `sidebar-link ${isActive ? 'activo' : ''}`}>
          <span>▦</span> Dashboard
        </NavLink>
        <NavLink to={`${base}/historial`} className={({ isActive }) => `sidebar-link ${isActive ? 'activo' : ''}`}>
          <span>▤</span> Historial
        </NavLink>
        <NavLink to={`${base}/alertas`} className={({ isActive }) => `sidebar-link ${isActive ? 'activo' : ''}`}>
          <span>△</span> Alertas
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div
          className="sidebar-link muted"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          title="Volver al selector de dispositivos"
        >
          <span>⇐</span> Dispositivos
        </div>
        <div
          className="sidebar-link muted"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <span>↪</span> {usuario?.username || 'Salir'}
        </div>
      </div>
    </aside>
  );
}
