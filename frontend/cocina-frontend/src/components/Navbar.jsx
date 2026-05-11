import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const estaActivo = (ruta) => location.pathname === ruta;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🔒 Monitor Cocina
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? '✕' : '☰'}
        </button>

        <ul className={`nav-menu ${menuAbierto ? 'activo' : ''}`}>
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${estaActivo('/') ? 'activo' : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              📊 Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/historial"
              className={`nav-link ${estaActivo('/historial') ? 'activo' : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              📈 Historial
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/alertas"
              className={`nav-link ${estaActivo('/alertas') ? 'activo' : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              🔔 Alertas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
