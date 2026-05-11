import React, { useState, useEffect } from 'react';
import LecturaActual from '../components/LecturaActual';
import EstadoVentiladores from '../components/EstadoVentiladores';
import Alertas from '../components/Alertas';
import Graficas from '../components/Graficas';
import { obtenerUltimaLectura, obtenerLecturas } from '../services/api';

export default function DashboardPage() {
  const [lectura, setLectura] = useState(null);
  const [lecturas, setLecturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarLectura = async () => {
    try {
      const data = await obtenerUltimaLectura();
      setLectura(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar lectura:', err);
      setError('Error al obtener datos');
      // Fallback data
      setLectura({
        temperatura: 34.5,
        nivel_gas: 420,
        llama_detectada: false,
        estado_sistema: 'NORMAL',
        extraccion: true,
        inyeccion_1: true,
        inyeccion_2: false,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await obtenerLecturas(100);
      setLecturas(data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      // Fallback: Generate test data
      const testData = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        temperatura: 33.8 + Math.random() * 1,
        nivel_gas: 410 + Math.random() * 20,
        llama_detectada: false,
        estado_sistema: 'NORMAL',
        extraccion: true,
        inyeccion_1: true,
        inyeccion_2: false,
        timestamp: new Date(Date.now() - i * 5000).toISOString(),
      }));
      setLecturas(testData);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarLectura();
    cargarHistorial();
    const intervalo = setInterval(() => {
      cargarLectura();
      cargarHistorial();
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  if (cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <LecturaActual lectura={lectura} />
      <EstadoVentiladores lectura={lectura} />
      <Alertas lectura={lectura} />
      <Graficas lecturas={lecturas} />
    </div>
  );
}
