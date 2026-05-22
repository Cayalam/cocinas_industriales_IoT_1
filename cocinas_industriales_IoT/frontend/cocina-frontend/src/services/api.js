import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Adjuntar token JWT a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  return config;
});

// Si el token expiró (401), intentar refresh automático
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  const { data } = await api.post('/auth/login/', { username, password });
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data.usuario;
};

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token');
  try { await api.post('/auth/logout/', { refresh }); } catch {}
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const obtenerPerfil = async () => {
  const { data } = await api.get('/auth/perfil/');
  return data;
};

export const estaAutenticado = () => !!localStorage.getItem('access_token');

// ── Dispositivos ──────────────────────────────────────────────────────────────
export const obtenerDispositivos = async () => {
  const { data } = await api.get('/dispositivos/');
  return Array.isArray(data) ? data : data.results || [];
};

// ── Lecturas por dispositivo ──────────────────────────────────────────────────
export const obtenerUltimaLectura = async (dispositivoId) => {
  const { data } = await api.get(`/dispositivos/${dispositivoId}/ultima/`);
  return data;
};

export const obtenerLecturas = async (dispositivoId, limit = 100) => {
  const { data } = await api.get(`/dispositivos/${dispositivoId}/lecturas/`, { params: { limit } });
  return Array.isArray(data) ? data : data.results || [];
};

export const obtenerAlertas = async (dispositivoId) => {
  const { data } = await api.get(`/dispositivos/${dispositivoId}/alertas/`);
  return data;
};

export const obtenerResumen = async (dispositivoId) => {
  const { data } = await api.get(`/dispositivos/${dispositivoId}/resumen/`);
  return data;
};

export const obtenerAnalisis = async (dispositivoId, periodo = '24h') => {
  const { data } = await api.get(`/dispositivos/${dispositivoId}/analisis/`, { params: { periodo } });
  return data;
};

export default api;
