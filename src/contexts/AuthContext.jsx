import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: newToken } = response.data.data;

      setUser(userData);
      setToken(newToken);
      localStorage.setItem('token', newToken);

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error en el login'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success && response.data.data.token) {
        const { user: userData, token: newToken } = response.data.data;

        setUser(userData);
        setToken(newToken);
        localStorage.setItem('token', newToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error en el registro'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const isAuthenticated = !!user && !!token;

  const normalizeRoleName = (name) => {
    if (!name) return null;
    const n = String(name).trim().toLowerCase();
    if (['admin', 'administrador', 'administradora'].includes(n)) return 'admin';
    if (['jefe', 'jefe de mecanico', 'jefe de mecánico', 'jefe mecanico'].includes(n)) return 'jefe';
    if (['mecanico', 'mecánico'].includes(n)) return 'mecanico';
    if (['cliente', 'client'].includes(n)) return 'cliente';
    if (['recepcionista', 'receptionist'].includes(n)) return 'recepcionista';
    return n;
  };

  const roleKey = normalizeRoleName(user?.role?.name);
  const isAdmin = roleKey === 'admin';
  const isChief = roleKey === 'jefe';
  const isMechanic = roleKey === 'mecanico';
  const isClient = roleKey === 'cliente';
  const isRecepcionista = roleKey === 'recepcionista';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isChief,
    isMechanic,
    isClient,
    isRecepcionista,
    roleKey,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;