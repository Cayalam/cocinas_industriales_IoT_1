import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerDispositivos } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SelectorDispositivo() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [dispositivos, setDispositivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDispositivos()
      .then(setDispositivos)
      .catch(() => setError('No se pudieron cargar los dispositivos'))
      .finally(() => setCargando(false));
  }, []);

  const seleccionar = (dispositivo) => {
    navigate(`/dispositivo/${dispositivo.id}`);
  };

  const colorEstado = (estado) => {
    const m = { NORMAL: '#22e07d', TEMPERATURA_ALTA: '#ffb347', GAS_DETECTADO: '#ff7a7a', LLAMA_DETECTADA: '#ff7a7a', EMERGENCIA: '#c62828' };
    return m[estado] || '#9fb5da';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d111d', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, maxWidth: 900, margin: '0 auto 32px' }}>
        <div>
          <div style={{ fontSize: 11, color: '#76a9ff', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>UIS · Sistema IoT</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: '#dbe7ff' }}>Seleccionar dispositivo</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#8ea0bf' }}>
            {usuario?.first_name || usuario?.username}
          </span>
          <button
            onClick={logout}
            style={{ height: 30, padding: '0 16px', background: 'transparent', border: '1px solid #2a3348', color: '#9fb5da', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {cargando && (
          <p style={{ color: '#8ea0bf', fontSize: 13 }}>Cargando dispositivos...</p>
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: '#301c22', border: '1px solid #743741', color: '#ff7a7a', fontSize: 13 }}>
            {error}
          </div>
        )}

        {!cargando && dispositivos.length === 0 && !error && (
          <div style={{ padding: '32px', background: '#151a27', border: '1px solid #22293a', textAlign: 'center' }}>
            <p style={{ color: '#8ea0bf', fontSize: 14 }}>No tienes dispositivos asignados.</p>
            <p style={{ color: '#5a6a80', fontSize: 12, marginTop: 4 }}>Pide al administrador que te asigne un ESP32.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {dispositivos.map((d) => {
            const ul = d.ultima_lectura;
            const estado = ul?.estado_sistema || 'SIN DATOS';
            return (
              <button
                key={d.id}
                onClick={() => seleccionar(d)}
                style={{
                  all: 'unset', cursor: 'pointer', display: 'block',
                  background: '#151a27', border: '1px solid #22293a',
                  padding: '20px', textAlign: 'left', transition: 'border-color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#76a9ff'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#22293a'}
              >
                {/* Indicador de estado */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#76a9ff', textTransform: 'uppercase', letterSpacing: '.7px' }}>
                    {d.codigo}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: colorEstado(estado), textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    ● {estado.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: '#dbe7ff', marginBottom: 4 }}>{d.nombre}</div>
                {d.ubicacion && (
                  <div style={{ fontSize: 12, color: '#8ea0bf', marginBottom: 12 }}>{d.ubicacion}</div>
                )}

                {ul && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 12, borderTop: '1px solid #1e2636' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#5a6a80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Temperatura</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#9db9ff', marginTop: 2 }}>{ul.temperatura}°C</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#5a6a80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Última lectura</div>
                      <div style={{ fontSize: 11, color: '#8ea0bf', marginTop: 4 }}>
                        {new Date(ul.timestamp).toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                )}

                {!ul && (
                  <div style={{ fontSize: 12, color: '#5a6a80', paddingTop: 12, borderTop: '1px solid #1e2636' }}>
                    Sin lecturas registradas aún
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
