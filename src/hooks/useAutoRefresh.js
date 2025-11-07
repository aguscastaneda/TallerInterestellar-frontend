import { useEffect, useCallback } from 'react';

export const useAutoRefresh = (refreshFunction, dependencies = []) => {
  const handleRefresh = useCallback(() => {
    if (refreshFunction) {
      refreshFunction();
    }
  }, [refreshFunction]);

  useEffect(() => {
    const handleAppRefresh = () => {
      handleRefresh();
    };

    window.addEventListener('app-refresh', handleAppRefresh);

    return () => {
      window.removeEventListener('app-refresh', handleAppRefresh);
    };
  }, [handleRefresh]);

  useEffect(() => {
    handleRefresh();
  }, dependencies);
};

export default useAutoRefresh;

