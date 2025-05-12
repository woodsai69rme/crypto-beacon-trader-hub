
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PriceAlertFormData } from '@/types/trading';

const LOCAL_STORAGE_KEY = 'crypto-alerts';

const useAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlertFormData[]>([]);
  
  // Load alerts from local storage
  useEffect(() => {
    const savedAlerts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Error parsing saved alerts:', error);
      }
    }
  }, []);
  
  // Save alerts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);
  
  const addAlert = (alert: PriceAlertFormData) => {
    const newAlert = {
      ...alert,
      id: uuidv4(),
      active: true,
      createdAt: new Date().toISOString()
    };
    
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  };
  
  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  const updateAlert = (alertId: string, data: Partial<PriceAlertFormData>) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, ...data } : alert
      )
    );
  };
  
  const toggleAlert = (alertId: string, active: boolean) => {
    updateAlert(alertId, { active });
  };
  
  return {
    alerts,
    addAlert,
    removeAlert,
    updateAlert,
    toggleAlert
  };
};

export default useAlerts;
