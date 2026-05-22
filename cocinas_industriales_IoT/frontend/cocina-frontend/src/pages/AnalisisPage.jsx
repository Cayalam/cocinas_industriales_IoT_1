import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { obtenerAnalisis, obtenerUltimaLectura } from '../services/api';
import '../styles/Dashboard.css';
import '../styles/AnalisisPage.css';

const PERIODOS = [
  { label: '1 hora', value: '1h' },
  { label: '6 horas', value: '6h' },
  { label: '24 horas', value: '24h' },
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
];

const COLORES_ESTADO = {
  NORMAL: '#22c55e',
  GAS_DETECTADO: '#ffd54f',
  TEMPERATURA_ALTA: '#ff8a65',
  LLAMA_DETECTADA: '#ff5252',
  EMERGENCIA: '#b71c1c',
  EMERGENCIA_GAS: '#e53935',
};

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1d2230', border: '1px solid #32394d', borderRadius: 0 },
  labelStyle: { color: '#9db9ff', fontSize: 11 },
};

export default function AnalisisPage() {
  const { dispositivoId } = useParams();
  const [lectura, setLectura] = useState(null);
  const [datos, setDatos] = useState(null);
  const [periodo, setPeriodo] = useState('24h');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      const [ultima, analisis] = await Promise.all([
        obtenerUltimaLectura(dispositivoId),
        obtenerAnalisis(dispositivoId, periodo),
      ]);
      setLectura(ultima);
      setDatos(analisis);
      setError(null);
    } catch (e) {
      setError('No se puede conectar al servidor');
      setDatos(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setCargando(true);
    cargar();
    const iv = setInterval(cargar, 10000);
    return () => clearInterval(iv);
  }, [dispositivoId, periodo]);

  const estado = lectura?.estado_sistema || 'SIN DATOS';
  const fecha = lectura?.timestamp ? new Date(lectura.timestamp).toLocaleString('es-CO') : '--';

  const serie = (datos?.serie || []).map(s => ({
    tiempo: new Date(s.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    temperatura: parseFloat(s.temperatura),
    gas: s.nivel_gas,
    presion: parseFloat(s.presion),
  }));

  const pieData = (datos?.distribucion_estados || []).map(e => ({
    name: e.estado_sistema.replace(/_/g, ' '),
    value: e.cantidad,
    color: COLORES_ESTADO[e.estado_sistema] || '#9db9ff',
  }));

  return (
    <main className="terminal-layout">
      <header className="terminal-topbar">
        <div>
          <h1>Análisis de Datos</h1>
          <span className={"topbar-status " + estado.toLowerCase().replace(/_/g, '-')}>
            ● {error ? 'API DESCONECTADA' : estado.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="topbar-actions">
          <span className="system-pill">{lectura?.dispositivo_codigo || `Dispositivo #${dispositivoId}`}</span>
        </div>
      </header>

      <section className="operation-banner">
        <div>
          <h2>● Análisis histórico del sistema</h2>
          <p>{error ?? 'Estadísticas y tendencias de los sensores a lo largo del tiempo.'}</p>
        </div>
        <div className="last-reading">
          <span>Última lectura</span>
          <strong>{fecha}</strong>
        </div>
      </section>

      {/* Selector de periodo */}
      <div className="analisis-periodos">
        {PERIODOS.map(p => (
          <button
            key={p.value}
            className={"periodo-btn " + (periodo === p.value ? 'activo' : '')}
            onClick={() => setPeriodo(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="loading-panel">Calculando análisis...</div>
      ) : error ? (
        <div className="loading-panel" style={{ color: '#ff7a7a' }}>🔌 {error}</div>
      ) : !datos || datos.total_lecturas === 0 ? (
        <div className="loading-panel">Sin datos en el período seleccionado</div>
      ) : (
        <div className="terminal-content analisis-content">

          {/* KPIs */}
          <div className="analisis-kpis">
            <div className="kpi-card">
              <span className="kpi-label">Lecturas totales</span>
              <span className="kpi-valor">{datos.total_lecturas.toLocaleString()}</span>
            </div>
            <div className="kpi-card kpi-temp">
              <span className="kpi-label">🌡️ Temp. Promedio</span>
              <span className="kpi-valor">{datos.temperatura.promedio}°C</span>
              <span className="kpi-sub">Máx: {datos.temperatura.maximo}°C · Mín: {datos.temperatura.minimo}°C</span>
            </div>
            <div className="kpi-card kpi-gas">
              <span className="kpi-label">💨 Gas Promedio</span>
              <span className="kpi-valor">{datos.gas.promedio} ppm</span>
              <span className="kpi-sub">Máx: {datos.gas.maximo} ppm</span>
            </div>
            <div className="kpi-card kpi-presion">
              <span className="kpi-label">🌬️ Presión Promedio</span>
              <span className="kpi-valor">{datos.presion.promedio} hPa</span>
              <span className="kpi-sub">Máx: {datos.presion.maximo} · Mín: {datos.presion.minimo}</span>
            </div>
          </div>

          {/* Eventos de seguridad */}
          <div className="analisis-eventos">
            <h3 className="seccion-titulo">Eventos de Seguridad</h3>
            <div className="eventos-grid">
              <div className={"evento-card " + (datos.eventos.emergencias > 0 ? 'alerta' : '')}>
                <span className="evento-icono">🚨</span>
                <span className="evento-valor">{datos.eventos.emergencias}</span>
                <span className="evento-label">Emergencias</span>
              </div>
              <div className={"evento-card " + (datos.eventos.llamas_detectadas > 0 ? 'alerta-fuego' : '')}>
                <span className="evento-icono">🔥</span>
                <span className="evento-valor">{datos.eventos.llamas_detectadas}</span>
                <span className="evento-label">Llamas detectadas</span>
              </div>
              <div className={"evento-card " + (datos.eventos.activaciones_aspersion > 0 ? 'alerta-agua' : '')}>
                <span className="evento-icono">💧</span>
                <span className="evento-valor">{datos.eventos.activaciones_aspersion}</span>
                <span className="evento-label">Aspersiones</span>
              </div>
              <div className={"evento-card " + (datos.eventos.cierres_valvulas > 0 ? 'alerta-valvula' : '')}>
                <span className="evento-icono">🔒</span>
                <span className="evento-valor">{datos.eventos.cierres_valvulas}</span>
                <span className="evento-label">Cierres de válvulas</span>
              </div>
            </div>
          </div>

          {/* Gráficas de serie temporal */}
          {serie.length > 0 && (
            <div className="analisis-graficas">
              <h3 className="seccion-titulo">Serie Temporal</h3>
              <div className="graficas-analisis-grid">

                <div className="grafica-analisis-card">
                  <h4>Temperatura (°C)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={serie} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                      <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 9 }} />
                      <YAxis stroke="#6a7fa0" style={{ fontSize: 9 }}
                        label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 10 }} />
                      <Tooltip {...tooltipStyle} formatter={v => [`${v.toFixed(1)}°C`, 'Temperatura']} />
                      <ReferenceLine y={40} stroke="#ff5252" strokeDasharray="4 2" label={{ value: 'Límite', fill: '#ff5252', fontSize: 9 }} />
                      <Line type="monotone" dataKey="temperatura" stroke="#ff7a7a" dot={false} strokeWidth={2} name="Temperatura" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grafica-analisis-card">
                  <h4>Nivel de Gas (ppm)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={serie} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                      <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 9 }} />
                      <YAxis stroke="#6a7fa0" style={{ fontSize: 9 }} domain={[0, 'auto']}
                        label={{ value: 'ppm', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 10 }} />
                      <Tooltip {...tooltipStyle} formatter={v => [`${v} ppm`, 'Gas']} />
                      <ReferenceLine y={300} stroke="#ffd54f" strokeDasharray="4 2" label={{ value: 'Alerta', fill: '#ffd54f', fontSize: 9 }} />
                      <Line type="monotone" dataKey="gas" stroke="#ffd54f" dot={false} strokeWidth={2} name="Gas" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grafica-analisis-card">
                  <h4>Presión (hPa)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={serie} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                      <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 9 }} />
                      <YAxis stroke="#6a7fa0" style={{ fontSize: 9 }}
                        label={{ value: 'hPa', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 10 }} />
                      <Tooltip {...tooltipStyle} formatter={v => [`${v.toFixed(1)} hPa`, 'Presión']} />
                      <ReferenceLine y={1035} stroke="#81c784" strokeDasharray="4 2" label={{ value: 'Alerta', fill: '#81c784', fontSize: 9 }} />
                      <Line type="monotone" dataKey="presion" stroke="#81c784" dot={false} strokeWidth={2} name="Presión" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>
          )}

          {/* Distribución de estados */}
          {pieData.length > 0 && (
            <div className="analisis-distribucion">
              <h3 className="seccion-titulo">Distribución de Estados</h3>
              <div className="distribucion-contenido">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
                      dataKey="value" nameKey="name" label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: '#9db9ff', strokeWidth: 1 }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1d2230', border: '1px solid #32394d' }}
                      formatter={(v, n) => [`${v} lecturas`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="distribucion-leyenda">
                  {pieData.map((e, i) => (
                    <div key={i} className="leyenda-item">
                      <span className="leyenda-dot" style={{ background: e.color }} />
                      <span className="leyenda-nombre">{e.name}</span>
                      <span className="leyenda-valor">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </main>
  );
}
