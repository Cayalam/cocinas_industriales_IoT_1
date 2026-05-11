import React, { useState, useEffect } from 'react';
import LecturaActual from './LecturaActual';
import EstadoVentiladores from './EstadoVentiladores';
import Alertas from './Alertas';
import HistorialLecturas from './HistorialLecturas';
import { obtenerUltimaLectura, obtenerLecturas } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [lectura, setLectura] = useState(null);
  const [lecturas, setLecturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar la última lectura al montar el componente
  useEffect(() => {
    const cargarLectura = async () => {
      try {
        setCargando(true);
        const datos = await obtenerUltimaLectura();
        setLectura(datos);
        setError(null);
      } catch (err) {
        console.error('Error al cargar lectura:', err);
        setError('Error al conectar con el servidor');
        // Datos de prueba para desarrollo
        setLectura({
          temperatura: 34.5,
          nivel_gas: 420,
          llama_detectada: false,
          ventilador_extraccion: true,
          ventilador_inyeccion_1: true,
          ventilador_inyeccion_2: false,
          estado_sistema: 'NORMAL',
          timestamp: new Date().toISOString(),
        });
      } finally {
        setCargando(false);
      }
    };

    const cargarHistorial = async () => {
      try {
        const datos = await obtenerLecturas();
        // Si es un array, usar directamente. Si es un objeto con 'results', usar eso.
        const lecturasList = Array.isArray(datos) ? datos : datos.results || [];
        setLecturas(lecturasList);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        // Datos de prueba para desarrollo
        const lecturasPrueba = [
          {
            temperatura: 34.5,
            nivel_gas: 420,
            llama_detectada: false,
            ventilador_extraccion: true,
            ventilador_inyeccion_1: true,
            ventilador_inyeccion_2: false,
            estado_sistema: 'NORMAL',
            timestamp: new Date(Date.now() - 0).toISOString(),
          },
          {
            temperatura: 34.2,
            nivel_gas: 418,
            llama_detectada: false,
            ventilador_extraccion: true,
            ventilador_inyeccion_1: true,
            ventilador_inyeccion_2: false,
            estado_sistema: 'NORMAL',
            timestamp: new Date(Date.now() - 5000).toISOString(),
          },
          {
            temperatura: 34.1,
            nivel_gas: 415,
            llama_detectada: false,
            ventilador_extraccion: true,
            ventilador_inyeccion_1: true,
            ventilador_inyeccion_2: false,
            estado_sistema: 'NORMAL',
            timestamp: new Date(Date.now() - 10000).toISOString(),
          },
          {
            temperatura: 33.9,
            nivel_gas: 412,
            llama_detectada: false,
            ventilador_extraccion: true,
            ventilador_inyeccion_1: true,
            ventilador_inyeccion_2: false,
            estado_sistema: 'NORMAL',
            timestamp: new Date(Date.now() - 15000).toISOString(),
          },
          {
            temperatura: 33.8,
            nivel_gas: 410,
            llama_detectada: false,
            ventilador_extraccion: true,
            ventilador_inyeccion_1: true,
            ventilador_inyeccion_2: false,
            estado_sistema: 'NORMAL',
            timestamp: new Date(Date.now() - 20000).toISOString(),
          },
        ];
        setLecturas(lecturasPrueba);
      }
    };

    cargarLectura();
    cargarHistorial();

    // Actualizar cada 5 segundos
    const intervalo = setInterval(() => {
      cargarLectura();
      cargarHistorial();
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🔒 Monitor de Seguridad - Cocina</h1>
        <div className="header-info">
          {error && <div className="error-banner">{error}</div>}
          {!error && (
            <div className="status-indicator">
              <div className={`status-dot ${lectura?.estado_sistema.toLowerCase()}`} />
              <span>Sistema Activo</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-container">
        <LecturaActual lectura={lectura} />
        <EstadoVentiladores lectura={lectura} />
        <Alertas lectura={lectura} />
        <HistorialLecturas lecturas={lecturas} />
      </div>

      {cargando && <div className="loading">Conectando con servidor...</div>}
    </div>
  );
};

export default Dashboard;
