import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import statusService from '../services/statusService';

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
        statusService.initialize(response.data.data);
      } else {
        console.error('Error en respuesta del servidor:', response.data);
        setConfig({
          roles: [],
          carStatuses: [],
          serviceRequestStatuses: [],
          paymentStatuses: [],
          paymentMethods: [],
          repairCategories: [],
          constants: {}
        });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      setConfig({
        roles: [],
        carStatuses: [],
        serviceRequestStatuses: [],
        paymentStatuses: [],
        paymentMethods: [],
        repairCategories: [],
        constants: {}
      });
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

  const getStatusColor = (statusId) => statusService.getStatusColor(statusId);
  const getStatusTabColor = (statusId) => statusService.getStatusTabColor(statusId);
  const getStatusName = (statusId) => statusService.getStatusName(statusId);
  const getStatusIcon = (statusId) => statusService.getStatusIcon(statusId);
  const isTerminalStatus = (statusId) => statusService.isTerminalStatus(statusId);
  const allowsTransitions = (statusId) => statusService.allowsTransitions(statusId);
  const getAvailableTransitions = (currentStatusId) => statusService.getAvailableTransitions(currentStatusId);
  const isValidTransition = (fromStatusId, toStatusId) => statusService.isValidTransition(fromStatusId, toStatusId);
  const getStatusInfo = (statusId) => statusService.getStatusInfo(statusId);
  const getAllStatuses = () => statusService.getAllStatuses();
  const filterByStatus = (items, statusId) => statusService.filterByStatus(items, statusId);
  const countByStatus = (items, statusId) => statusService.countByStatus(items, statusId);

  const translateServiceRequestStatus = (status) => {
    const statusConfig = config.serviceRequestStatuses.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const getConstants = () => {
    return config.constants || {};
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
    getStatusName,
    getStatusIcon,
    isTerminalStatus,
    allowsTransitions,
    getAvailableTransitions,
    isValidTransition,
    getStatusInfo,
    getAllStatuses,
    filterByStatus,
    countByStatus,
    translateServiceRequestStatus,
    getConstants
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};