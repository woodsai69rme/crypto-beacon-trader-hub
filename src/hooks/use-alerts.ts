
import { useState, useCallback } from 'react';

// Define the Alert type
export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean; // True if alert triggers when price goes above target, false for below
  timestamp?: string;
  enabled: boolean;
  recurring?: boolean;
  percentageChange?: number;
}

// Define the hook
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
      enabled: true,
    };
    
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, []);
  
  const removeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);
  
  const updateAlert = useCallback((alertId: string, updates: Partial<Alert>) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, ...updates } : alert
      )
    );
  }, []);
  
  return {
    alerts,
    addAlert,
    removeAlert,
    updateAlert
  };
}

export default useAlerts;
