
import { useState, useEffect } from 'react';
import { AlertData } from '@/types/alerts';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>(() => {
    // Load from localStorage if available
    try {
      const saved = localStorage.getItem('alerts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading alerts from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage when alerts change
  useEffect(() => {
    try {
      localStorage.setItem('alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving alerts to localStorage:', error);
    }
  }, [alerts]);

  const addAlert = (alertData: AlertData) => {
    // Ensure the alert data has the correct type
    setAlerts(prev => [...prev, alertData as AlertData]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const updateAlert = (id: string, updates: Partial<AlertData>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    updateAlert,
    clearAlerts
  };
};
