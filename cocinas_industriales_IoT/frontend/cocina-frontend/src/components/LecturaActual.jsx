import React, { useState, useEffect } from 'react';
import '../styles/LecturaActual.css';

const LecturaActual = ({ lectura, error }) => {
  // 9. Contador "hace X segundos"
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!lectura?.timestamp) return;
    const calcular = () => {
      const diff = Math.floor((Date.now() - new Date(lectura.timestamp).getTime()) / 1000);
      setSegundos(diff);
    };
    calcular();
    const t = setInterval(calcular, 1000);
    return () => clearInterval(t);
  }, [lectura?.timestamp]);

  const textoTiempo = () => {
    if (segundos < 10) return 'hace un momento';
    if (segundos < 60) return `hace ${segundos}s`;
    if (segundos < 3600) return `hace ${Math.floor(segundos / 60)}m`;
    return `hace ${Math.floor(segundos / 3600)}h`;
  };

  if (error) {
    return (
      <div className="lectura-actual error-state">
        <div style={{ color: '#ff7a7a', fontSize: 16, fontWeight: 'bold' }}>🔌 API Desconectada</div>
        <p style={{ color: '#ff7a7a', marginTop: 10, fontSize: 13 }}>{error}</p>
      </div>
    );
  }

  if (!lectura) {
    return <div className="lectura-actual"><p>⏳ Conectando...</p></div>;
  }

  const getColorEstado = estado => ({
    NORMAL: '#22e07d',
    TEMPERATURA_ALTA: '#ffb347',
    GAS_DETECTADO: '#ff7a7a',
    LLAMA_DETECTADA: '#ff7a7a',
    EMERGENCIA: '#c62828',
  }[estado] || '#9fb5da');

  return (
    <div className="lectura-actual">
      <div className="lectura-grid">
        <div className="lectura-card">
          <span className="lectura-label">🌡️ Temperatura</span>
          <span className="lectura-valor">{lectura.temperatura}°C</span>
        </div>

        <div className="lectura-card">
          <span className="lectura-label">💨 Nivel de Gas</span>
          <span className="lectura-valor">{lectura.nivel_gas}</span>
        </div>

        <div className="lectura-card">
          <span className="lectura-label">🌬️ Presión</span>
          <span className="lectura-valor">{parseFloat(lectura.presion).toFixed(1)} hPa</span>
        </div>

        <div className="lectura-card">
          <span className="lectura-label">🔥 Llama Detectada</span>
          <span className={`lectura-valor ${lectura.llama_detectada ? 'alerta' : 'normal'}`}>
            {lectura.llama_detectada ? 'SÍ' : 'NO'}
          </span>
        </div>

        <div className="lectura-card">
          <span className="lectura-label">🖥️ Estado del Sistema</span>
          <span className="lectura-valor estado"
            style={{ backgroundColor: getColorEstado(lectura.estado_sistema) }}>
            {lectura.estado_sistema.replace(/_/g, ' ')}
          </span>
          {/* Indicador de frescura de datos */}
          <span className="lectura-frescura" style={{ color: segundos > 15 ? '#ffb347' : '#22e07d' }}>
            ● {textoTiempo()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LecturaActual;
