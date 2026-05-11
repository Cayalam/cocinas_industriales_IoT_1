import axios from 'axios';

// Configurar la URL base del API
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene la última lectura registrada
 * @returns {Promise} Última lectura del sistema
 */
export const obtenerUltimaLectura = async () => {
  try {
    const response = await api.get('/lecturas/ultima/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener última lectura:', error);
    throw error;
  }
};

/**
 * Obtiene todas las lecturas (historial)
 * @param {number} limit - Límite de resultados
 * @returns {Promise} Array de lecturas
 */
export const obtenerLecturas = async (limit = 100) => {
  try {
    const response = await api.get('/lecturas/', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener lecturas:', error);
    throw error;
  }
};

/**
 * Obtiene solo las alertas (lecturas con estado != NORMAL)
 * @returns {Promise} Array de alertas
 */
export const obtenerAlertas = async () => {
  try {
    const response = await api.get('/lecturas/alertas/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    throw error;
  }
};

export default api;
