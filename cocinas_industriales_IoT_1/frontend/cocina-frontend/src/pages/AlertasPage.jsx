import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerUltimaLectura, obtenerAlertas } from '../services/api';
import '../styles/Dashboard.css';
import '../styles/AlertasPage.css';

export default function AlertasPage() {
  const { dispositivoId } = useParams();
  const [lectura, setLectura] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      const [ultima, als] = await Promise.all([
        obtenerUltimaLectura(dispositivoId),
        obtenerAlertas(dispositivoId),
      ]);
      setLectura(ultima);
      setAlertas(als);
      setError(null);
    } catch {
      setError('No se puede conectar al servidor');
      setLectura(null);
      setAlertas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 5000);
    return () => clearInterval(intervalo);
  }, [dispositivoId]);

  const estado = lectura?.estado_sistema || 'SIN DATOS';
  const fecha = lectura?.timestamp ? new Date(lectura.timestamp).toLocaleString('es-CO') : '--';

  const estadoInfo = {
    NORMAL: { color: '#22c55e', icono: '✅', titulo: 'Sistema Normal', desc: 'Todo está funcionando correctamente' },
    TEMPERATURA_ALTA: { color: '#f97316', icono: '🌡️', titulo: 'Temperatura Elevada', desc: 'La temperatura excede el límite permitido' },
    GAS_DETECTADO: { color: '#ef4444', icono: '⚠️', titulo: 'Gas Detectado', desc: 'Se ha detectado presencia de gas' },
    LLAMA_DETECTADA: { color: '#dc2626', icono: '🔥', titulo: 'Llama Detectada', desc: 'Se ha detectado una llama no autorizada' },
    EMERGENCIA: { color: '#7f1d1d', icono: '🚨', titulo: 'EMERGENCIA', desc: 'Situación crítica del sistema' },
  };

  const info = estadoInfo[estado] || estadoInfo.NORMAL;

  return (
    <main className="terminal-layout">
      <header className="terminal-topbar">
        <div>
          <h1>Centro de Alertas</h1>
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
          <p>{error ?? 'Monitoreando eventos de alerta del dispositivo.'}</p>
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
          <div className="estado-actual" style={{ borderLeftColor: info.color }}>
            <div className="estado-icono">{info.icono}</div>
            <div className="estado-info">
              <h3 style={{ color: info.color }}>{info.titulo}</h3>
              <p>{info.desc}</p>
            </div>
          </div>

          <div className="lecturas-criticas">
            <h3>Valores Críticos</h3>
            <div className="criticas-grid">
              <div className={`critica-card ${parseFloat(lectura?.temperatura) > 60 ? 'alerta' : ''}`}>
                <span className="critica-label">Temperatura</span>
                <span className="critica-valor">{lectura?.temperatura}°C</span>
                <span className="critica-rango">Límite: 60°C</span>
              </div>
              <div className={`critica-card ${lectura?.nivel_gas > 500 ? 'alerta' : ''}`}>
                <span className="critica-label">Nivel de Gas</span>
                <span className="critica-valor">{lectura?.nivel_gas} ppm</span>
                <span className="critica-rango">Límite: 500 ppm</span>
              </div>
              <div className={`critica-card ${lectura?.llama_detectada ? 'alerta' : ''}`}>
                <span className="critica-label">Llama</span>
                <span className="critica-valor">{lectura?.llama_detectada ? '🔥 DETECTADA' : '✅ No detectada'}</span>
                <span className="critica-rango">Crítico si: SÍ</span>
              </div>
            </div>
          </div>

          <div className="historial-alertas">
            <h3>Historial de Alertas</h3>
            {alertas.length === 0 ? (
              <div className="sin-alertas"><p>✅ No hay alertas registradas</p></div>
            ) : (
              <div className="alertas-list">
                {alertas.map((a, i) => (
                  <div key={i} className="alerta-item">
                    <div className="alerta-tiempo">{new Date(a.timestamp).toLocaleString('es-CO')}</div>
                    <div className="alerta-tipo">{a.estado_sistema.replace(/_/g, ' ')}</div>
                    <div className="alerta-mensaje">Temp: {a.temperatura}°C · Gas: {a.nivel_gas}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
