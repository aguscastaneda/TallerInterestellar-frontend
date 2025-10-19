import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig debe ser usado dentro de un ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    roles: [],
    carStatuses: [],
    serviceRequestStatuses: [],
    paymentStatuses: [],
    paymentMethods: [],
    constants: {}
  });
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/config/system');
      if (response.data.success) {
        setConfig(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);


  const getRoleById = (roleId) => {
    return config.roles.find(role => role.id === roleId);
  };


  const getCarStatusById = (statusId) => {
    return config.carStatuses.find(status => status.id === statusId);
  };


  const getCarStatusByName = (statusName) => {
    return config.carStatuses.find(status => status.name === statusName);
  };


  const getStatusColor = (statusId) => {
    const status = getCarStatusById(statusId);
    return status?.color || 'bg-gray-100 text-gray-800';
  };


  const getStatusTabColor = (statusId) => {
    const status = getCarStatusById(statusId);
    return status?.tabColor || 'bg-gray-500 hover:bg-gray-600';
  };


  const translateServiceRequestStatus = (status) => {
    const statusConfig = config.serviceRequestStatuses.find(s => s.value === status);
    return statusConfig?.label || status;
  };


  const getConstants = () => {
    return config.constants;
  };

  const value = {
    config,
    loading,
    loadConfig,
    getRoleById,
    getCarStatusById,
    getCarStatusByName,
    getStatusColor,
    getStatusTabColor,
    translateServiceRequestStatus,
    getConstants
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
