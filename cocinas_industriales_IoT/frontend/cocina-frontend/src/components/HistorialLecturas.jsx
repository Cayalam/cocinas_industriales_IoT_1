import React, { useState } from 'react';
import '../styles/HistorialLecturas.css';

const HistorialLecturas = ({ lecturas, error }) => {
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  if (error) {
    return (
      <div className="historial-lecturas error-state">
        <h3>Historial de Lecturas</h3>
        <div className="historial-vacio">
          <p style={{ color: '#ff7a7a' }}>🔌 API Desconectada</p>
        </div>
      </div>
    );
  }

  if (!lecturas || lecturas.length === 0) {
    return (
      <div className="historial-lecturas">
        <h3>Historial de Lecturas</h3>
        <div className="historial-vacio"><p>⏳ Esperando datos del dispositivo...</p></div>
      </div>
    );
  }

  const totalPaginas = Math.ceil(lecturas.length / itemsPorPagina);
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const lecturasPagina = lecturas.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const formatearFecha = ts => new Date(ts).toLocaleString('es-CO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const colorEstado = estado => ({
    NORMAL: '#22e07d',
    TEMPERATURA_ALTA: '#ffb347',
    GAS_DETECTADO: '#ff7a7a',
    LLAMA_DETECTADA: '#ff7a7a',
    EMERGENCIA: '#c62828',
  }[estado] || '#9fb5da');

  return (
    <div className="historial-lecturas">
      <h3>Historial de Lecturas</h3>
      <div className="historial-info">
        <span>Total de registros: {lecturas.length}</span>
        <span>Página {pagina} de {totalPaginas}</span>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Fecha / Hora</th>
              <th>Temperatura</th>
              <th>Gas</th>
              <th>Presión</th>
              <th>Llama</th>
              <th>Extracción</th>
              <th>Inyección 1</th>
              <th>Inyección 2</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lecturasPagina.map(lectura => (
              // 7. Usar lectura.id como key en vez del índice del array
              <tr key={lectura.id}>
                <td className="celda-fecha">{formatearFecha(lectura.timestamp)}</td>
                <td className="celda-numero">{lectura.temperatura}°C</td>
                <td className="celda-numero">{lectura.nivel_gas}</td>
                <td className="celda-numero">{parseFloat(lectura.presion).toFixed(2)} hPa</td>
                <td className="celda-booleano">{lectura.llama_detectada ? '🔥' : '✅'}</td>
                <td className="celda-booleano">{lectura.ventilador_extraccion ? '✅' : '❌'}</td>
                <td className="celda-booleano">{lectura.ventilador_inyeccion_1 ? '✅' : '❌'}</td>
                <td className="celda-booleano">{lectura.ventilador_inyeccion_2 ? '✅' : '❌'}</td>
                <td>
                  <span className="estado-badge"
                    style={{ color: colorEstado(lectura.estado_sistema), background: `${colorEstado(lectura.estado_sistema)}18` }}>
                    {lectura.estado_sistema.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button className="btn-pagina"
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}>← Anterior</button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
            <button key={num}
              className={`numero-pagina ${pagina === num ? 'activo' : ''}`}
              onClick={() => setPagina(num)}>{num}</button>
          ))}

          <button className="btn-pagina"
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}>Siguiente →</button>
        </div>
      )}
    </div>
  );
};

export default HistorialLecturas;
