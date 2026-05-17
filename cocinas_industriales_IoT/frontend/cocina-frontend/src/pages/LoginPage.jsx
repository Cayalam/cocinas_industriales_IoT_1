import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d111d',
    }}>
      <div style={{
        width: 360, background: '#151a27', border: '1px solid #22293a', padding: '40px 36px',
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#76a9ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
            UIS · Sistema IoT
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#dbe7ff' }}>
            Cocinas Industriales
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#8ea0bf' }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9fb5da', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 6 }}>
              Usuario
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              style={{
                width: '100%', height: 40, background: '#0d111d', border: '1px solid #2a3348',
                color: '#dbe7ff', fontSize: 14, padding: '0 12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9fb5da', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{
                width: '100%', height: 40, background: '#0d111d', border: '1px solid #2a3348',
                color: '#dbe7ff', fontSize: 14, padding: '0 12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 12px', background: '#301c22', border: '1px solid #743741', color: '#ff7a7a', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%', height: 42, background: '#1e3a5f', border: '1px solid #76a9ff',
              color: '#dbe7ff', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px',
              cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1,
            }}
          >
            {cargando ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
