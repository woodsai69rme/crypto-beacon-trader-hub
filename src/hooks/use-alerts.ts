
import { useState, useEffect } from 'react';
import { AlertData, AlertFormData, PriceAlert, VolumeAlert, TechnicalAlert } from '@/types/alerts';
import { v4 as uuidv4 } from 'uuid';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('crypto-alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Error loading alerts from localStorage:', error);
      }
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crypto-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (formData: AlertFormData) => {
    const now = new Date().toISOString();
    let newAlert: AlertData;

    // Create the appropriate alert type
    switch (formData.type) {
      case 'price':
        newAlert = {
          ...formData,
          id: uuidv4(),
          createdAt: now,
        } as PriceAlert;
        break;
      
      case 'volume':
        newAlert = {
          ...formData,
          id: uuidv4(),
          createdAt: now,
        } as VolumeAlert;
        break;
      
      case 'technical':
        newAlert = {
          ...formData,
          id: uuidv4(),
          createdAt: now,
        } as TechnicalAlert;
        break;
      
      default:
        throw new Error(`Invalid alert type: ${formData.type}`);
    }

    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    return newAlert;
  };

  const removeAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const updateAlert = (alertId: string, updates: Partial<AlertData>) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, ...updates } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    updateAlert,
    clearAllAlerts
  };
};
