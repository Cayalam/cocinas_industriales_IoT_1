import React from 'react';
import '../styles/EstadoVentiladores.css';

const EstadoVentiladores = ({ lectura, error }) => {
  if (error) {
    return (
      <div className="estado-ventiladores error-state">
        <h3>ESTADO DE VENTILADORES</h3>
        <p style={{ color: '#ff6b6b', fontSize: '16px', marginTop: '20px', fontWeight: 'bold' }}>🔌 API Desconectada</p>
        <p style={{ color: '#ff6b6b', fontSize: '14px' }}>No se puede conectar al servidor</p>
      </div>
    );
  }

  if (!lectura) {
    return <div className="estado-ventiladores"><p>⏳ Cargando...</p></div>;
  }

  const ventiladores = [
    { nombre: 'Ventilador Extracción', estado: lectura.ventilador_extraccion, icono: '⬆️' },
    { nombre: 'Ventilador Inyección 1', estado: lectura.ventilador_inyeccion_1, icono: '➡️' },
    { nombre: 'Ventilador Inyección 2', estado: lectura.ventilador_inyeccion_2, icono: '➡️' },
  ];

  const actuadores = [
    {
      nombre: 'Aspersión',
      estado: lectura.aspersion_activa,
      icono: '💧',
      colorActivo: '#26c6da',
      labelActivo: 'ACTIVA',
      labelInactivo: 'INACTIVA',
    },
    {
      nombre: 'Válvulas Gas',
      estado: lectura.valvulas_cerradas,
      icono: '🔒',
      colorActivo: '#ef5350',
      labelActivo: 'CERRADAS',
      labelInactivo: 'ABIERTAS',
    },
    {
      nombre: 'Evacuación',
      estado: lectura.evacuacion_activa,
      icono: '🚨',
      colorActivo: '#ff5252',
      labelActivo: 'ACTIVA',
      labelInactivo: 'INACTIVA',
    },
  ];

  return (
    <div className="estado-ventiladores">
      <h3>Estado de Ventiladores</h3>
      <div className="ventiladores-grid">
        {ventiladores.map((ventilador, index) => (
          <div
            key={index}
            className={"ventilador-card " + (ventilador.estado ? 'activo' : 'inactivo')}
          >
            <div className="ventilador-icono">{ventilador.icono}</div>
            <div className="ventilador-nombre">{ventilador.nombre}</div>
            <div className="ventilador-estado">
              <span className={"estado-badge " + (ventilador.estado ? 'encendido' : 'apagado')}>
                {ventilador.estado ? 'ENCENDIDO' : 'APAGADO'}
              </span>
            </div>
            <div className={"ventilador-indicador " + (ventilador.estado ? 'activo' : '')} />
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '24px', marginBottom: '14px' }}>Actuadores de Emergencia</h3>
      <div className="ventiladores-grid">
        {actuadores.map((act, index) => (
          <div
            key={index}
            className={"ventilador-card actuador-card " + (act.estado ? 'activo' : 'inactivo')}
            style={act.estado ? { borderColor: act.colorActivo, background: act.colorActivo + '18' } : {}}
          >
            <div className="ventilador-icono">{act.icono}</div>
            <div className="ventilador-nombre">{act.nombre}</div>
            <div className="ventilador-estado">
              <span
                className={"estado-badge " + (act.estado ? 'encendido' : 'apagado')}
                style={act.estado ? { backgroundColor: act.colorActivo + '33', color: act.colorActivo, borderColor: act.colorActivo } : {}}
              >
                {act.estado ? act.labelActivo : act.labelInactivo}
              </span>
            </div>
            <div
              className={"ventilador-indicador " + (act.estado ? 'activo' : '')}
              style={act.estado ? { backgroundColor: act.colorActivo } : {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadoVentiladores;
