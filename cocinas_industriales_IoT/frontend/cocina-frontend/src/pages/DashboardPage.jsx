import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LecturaActual from '../components/LecturaActual';
import EstadoVentiladores from '../components/EstadoVentiladores';
import Alertas from '../components/Alertas';
import Graficas from '../components/Graficas';
import { obtenerUltimaLectura, obtenerLecturas } from '../services/api';
import '../styles/Dashboard.css';

export default function DashboardPage() {
  const { dispositivoId } = useParams();
  const [lectura, setLectura] = useState(null);
  const [lecturas, setLecturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      const [ultima, hist] = await Promise.all([
        obtenerUltimaLectura(dispositivoId),
        obtenerLecturas(dispositivoId, 100),
      ]);
      setLectura(ultima);
      setLecturas(hist);
      setError(null);
    } catch (err) {
      setError('No se puede conectar al servidor');
      setLectura(null);
      setLecturas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 5000);
    return () => clearInterval(intervalo);
  }, [dispositivoId]);

  const estado = lectura?.estado_sistema || 'SIN DATOS';
  const fecha = lectura?.timestamp ? new Date(lectura.timestamp).toLocaleString('es-CO') : '--';

  return (
    <main className="terminal-layout">
      <header className="terminal-topbar">
        <div>
          <h1>Monitoreo</h1>
          <span className={`topbar-status ${estado.toLowerCase().replaceAll('_', '-')}`}>
            ● {error ? 'API DESCONECTADA' : estado.replaceAll('_', ' ')}
          </span>
        </div>
        <div className="topbar-actions">
          <span className="system-pill">{lectura?.dispositivo_codigo || `Dispositivo #${dispositivoId}`}</span>
          <button className="emergency-btn">Emergencia</button>
        </div>
      </header>

      <section className="operation-banner">
        <div>
          <h2>● Estado operativo: {estado.replaceAll('_', ' ')}</h2>
          <p>{error ?? 'Todos los parámetros se encuentran dentro de los rangos configurados.'}</p>
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
          <LecturaActual lectura={lectura} error={error} />
          <EstadoVentiladores lectura={lectura} error={error} />
          <Alertas lectura={lectura} error={error} />
          <Graficas lecturas={lecturas} error={error} />
        </div>
      )}
    </main>
  );
}
