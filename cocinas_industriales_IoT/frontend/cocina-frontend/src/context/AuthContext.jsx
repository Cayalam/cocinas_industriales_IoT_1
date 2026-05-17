import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, obtenerPerfil, estaAutenticado } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (estaAutenticado()) {
      obtenerPerfil()
        .then(setUsuario)
        .catch(() => { setUsuario(null); })
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, []);

  const login = async (username, password) => {
    const user = await apiLogin(username, password);
    setUsuario(user);
    return user;
  };

  const logout = async () => {
    await apiLogout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
