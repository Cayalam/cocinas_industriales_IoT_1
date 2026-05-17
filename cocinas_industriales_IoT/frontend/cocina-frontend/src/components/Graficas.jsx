import React from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import '../styles/Graficas.css';

const Graficas = ({ lecturas, error }) => {
  if (error) {
    return (
      <div className="graficas-seccion error-state">
        <h3>Gráficas de Monitoreo</h3>
        <p style={{ color: '#ff7a7a', marginTop: 20 }}>🔌 API Desconectada</p>
      </div>
    );
  }

  if (!lecturas || lecturas.length === 0) {
    return (
      <div className="graficas-seccion">
        <h3>Gráficas de Monitoreo</h3>
        <p className="sin-datos">⏳ Esperando datos del dispositivo...</p>
      </div>
    );
  }

  // Las lecturas llegan ordenadas DESC desde el backend (más reciente primero)
  // Invertimos para que el eje X vaya de más antiguo a más reciente (izquierda → derecha)
  const datosGrafica = [...lecturas]
    .slice(0, 20)       // últimas 20
    .reverse()          // ahora van de más antiguo a más reciente
    .map((lectura, index) => ({
      id: lectura.id || index,
      tiempo: new Date(lectura.timestamp).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      temperatura: parseFloat(lectura.temperatura),
      gas: lectura.nivel_gas,
      presion: parseFloat(lectura.presion),
    }));

  const temps = datosGrafica.map(d => d.temperatura);
  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#1d2230', border: '1px solid #32394d', borderRadius: 0 },
    labelStyle: { color: '#9db9ff', fontSize: 11 },
  };

  return (
    <div className="graficas-seccion">
      <h3>Gráficas de Monitoreo</h3>

      <div className="graficas-grid">
        {/* Temperatura */}
        <div className="grafica-card">
          <h4>Temperatura vs Tiempo</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosGrafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" />
              <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 10 }} />
              <YAxis stroke="#6a7fa0" domain={[minTemp, maxTemp]}
                label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 11 }}
                style={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v.toFixed(1)}°C`, 'Temperatura']} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Line type="monotone" dataKey="temperatura" stroke="#ff7a7a"
                dot={{ fill: '#ff7a7a', r: 3 }} activeDot={{ r: 5 }}
                name="Temperatura" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gas */}
        <div className="grafica-card">
          <h4>Nivel de Gas vs Tiempo</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosGrafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" />
              <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 10 }} />
              <YAxis stroke="#6a7fa0" domain={[0, 1023]}
                label={{ value: 'ppm', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 11 }}
                style={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v} ppm`, 'Gas']} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Line type="monotone" dataKey="gas" stroke="#ffd54f"
                dot={{ fill: '#ffd54f', r: 3 }} activeDot={{ r: 5 }}
                name="Nivel de Gas" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Presión */}
        <div className="grafica-card">
          <h4>Presión vs Tiempo</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosGrafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" />
              <XAxis dataKey="tiempo" stroke="#6a7fa0" style={{ fontSize: 10 }} />
              <YAxis stroke="#6a7fa0"
                label={{ value: 'hPa', angle: -90, position: 'insideLeft', fill: '#6a7fa0', fontSize: 11 }}
                style={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v.toFixed(2)} hPa`, 'Presión']} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Line type="monotone" dataKey="presion" stroke="#81c784"
                dot={{ fill: '#81c784', r: 3 }} activeDot={{ r: 5 }}
                name="Presión" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Graficas;
