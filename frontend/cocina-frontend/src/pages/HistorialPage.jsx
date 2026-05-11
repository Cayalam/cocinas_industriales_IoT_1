import React, { useState, useEffect } from 'react';
import HistorialLecturas from '../components/HistorialLecturas';
import { obtenerLecturas } from '../services/api';
import '../styles/HistorialPage.css';

export default function HistorialPage() {
  const [lecturas, setLecturas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarHistorial = async () => {
    try {
      const data = await obtenerLecturas(100);
      setLecturas(data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      // Fallback: Generate test data
      const testData = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        temperatura: 33.8 + Math.random() * 1.5,
        nivel_gas: 410 + Math.random() * 30,
        llama_detectada: Math.random() < 0.1,
        estado_sistema: Math.random() < 0.9 ? 'NORMAL' : 'TEMPERATURA_ALTA',
        extraccion: Math.random() < 0.8,
        inyeccion_1: Math.random() < 0.9,
        inyeccion_2: Math.random() < 0.5,
        timestamp: new Date(Date.now() - i * 5000).toISOString(),
      }));
      setLecturas(testData);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarHistorial();
    const intervalo = setInterval(cargarHistorial, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="historial-page">
      <div className="historial-header">
        <h2>📊 Historial de Lecturas</h2>
        <p>Todos los registros del sistema</p>
      </div>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <div className="historial-stats">
            <div className="stat-card">
              <span className="stat-label">Total de Lecturas</span>
              <span className="stat-value">{lecturas.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Temperatura Promedio</span>
              <span className="stat-value">
                {lecturas.length > 0
                  ? (lecturas.reduce((acc, l) => acc + parseFloat(l.temperatura), 0) / lecturas.length).toFixed(1)
                  : '0'}
                °C
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Gas Promedio</span>
              <span className="stat-value">
                {lecturas.length > 0
                  ? Math.round(lecturas.reduce((acc, l) => acc + l.nivel_gas, 0) / lecturas.length)
                  : '0'}
                 ppm
              </span>
            </div>
          </div>

          <HistorialLecturas lecturas={lecturas} />
        </>
      )}
    </div>
  );
}
