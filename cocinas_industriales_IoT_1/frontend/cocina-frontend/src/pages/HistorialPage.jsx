import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HistorialLecturas from '../components/HistorialLecturas';
import { obtenerLecturas, obtenerUltimaLectura } from '../services/api';
import '../styles/Dashboard.css';
import '../styles/HistorialPage.css';

export default function HistorialPage() {
  const { dispositivoId } = useParams();
  const [lecturas, setLecturas] = useState([]);
  const [lectura, setLectura] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      const [hist, ultima] = await Promise.all([
        obtenerLecturas(dispositivoId, 100),
        obtenerUltimaLectura(dispositivoId),
      ]);
      setLecturas(hist);
      setLectura(ultima);
      setError(null);
    } catch {
      setError('No se puede conectar al servidor');
      setLecturas([]);
      setLectura(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 10000);
    return () => clearInterval(intervalo);
  }, [dispositivoId]);

  const estado = lectura?.estado_sistema || 'SIN DATOS';
  const fecha = lectura?.timestamp ? new Date(lectura.timestamp).toLocaleString('es-CO') : '--';

  return (
    <main className="terminal-layout">
      <header className="terminal-topbar">
        <div>
          <h1>Historial de Lecturas</h1>
          <span className={`topbar-status ${estado.toLowerCase().replaceAll('_', '-')}`}>
            ● {error ? 'API DESCONECTADA' : estado.replaceAll('_', ' ')}
          </span>
        </div>
        <div className="topbar-actions">
          <span className="system-pill">{lectura?.dispositivo_codigo || `Dispositivo #${dispositivoId}`}</span>
        </div>
      </header>

      <section className="operation-banner">
        <div>
          <h2>● Estado operativo: {estado.replaceAll('_', ' ')}</h2>
          <p>{error ?? 'Registros históricos del dispositivo seleccionado.'}</p>
        </div>
        <div className="last-reading">
          <span>Última lectura</span>
          <strong>{fecha}</strong>
        </div>
      </section>

      {cargando ? (
        <div className="loading-panel">Conectando con servidor...</div>
      ) : (
        <div className="terminal-content">
          <div className="historial-stats">
            <div className="stat-card">
              <span className="stat-label">Total de Lecturas</span>
              <span className="stat-value">{lecturas.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Temperatura Promedio</span>
              <span className="stat-value">
                {lecturas.length > 0
                  ? (lecturas.reduce((a, l) => a + parseFloat(l.temperatura), 0) / lecturas.length).toFixed(1)
                  : '0'}°C
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Gas Promedio</span>
              <span className="stat-value">
                {lecturas.length > 0
                  ? Math.round(lecturas.reduce((a, l) => a + l.nivel_gas, 0) / lecturas.length)
                  : '0'} ppm
              </span>
            </div>
          </div>
          <HistorialLecturas lecturas={lecturas} />
        </div>
      )}
    </main>
  );
}
