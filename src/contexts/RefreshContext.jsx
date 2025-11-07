import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const RefreshContext = createContext();

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh debe ser usado dentro de un RefreshProvider');
  }
  return context;
};

export const RefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [listeners, setListeners] = useState(new Set());

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('app-refresh'));
  }, []);

  const registerListener = useCallback((callback) => {
    const id = Date.now() + Math.random();
    setListeners(prev => new Set([...prev, { id, callback }]));
    return () => {
      setListeners(prev => {
        const newSet = new Set(prev);
        const toRemove = Array.from(newSet).find(item => item.id === id);
        if (toRemove) {
          newSet.delete(toRemove);
        }
        return newSet;
      });
    };
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      listeners.forEach(({ callback }) => {
        try {
          callback();
        } catch (error) {
          console.error('Error en listener de refresh:', error);
        }
      });
    };

    window.addEventListener('app-refresh', handleRefresh);
    return () => {
      window.removeEventListener('app-refresh', handleRefresh);
    };
  }, [listeners]);

  const value = {
    refreshKey,
    triggerRefresh,
    registerListener
  };

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  );
};

RefreshProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RefreshContext;

