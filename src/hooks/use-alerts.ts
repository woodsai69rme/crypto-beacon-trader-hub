
import { useState, useEffect } from 'react';
import { AlertData, AlertFormData, PriceAlert, VolumeAlert, TechnicalAlert, AlertFrequency } from '@/types/alerts';
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

  const addAlert = (formData: AlertFormData): AlertData => {
    const now = new Date().toISOString();
    let newAlert: AlertData;

    // Create the appropriate alert type
    switch (formData.type) {
      case 'price':
        newAlert = {
          id: uuidv4(),
          type: 'price',
          coinId: formData.coinId,
          coinName: formData.coinName,
          coinSymbol: formData.coinSymbol,
          enabled: formData.enabled,
          notifyVia: formData.notifyVia,
          frequency: formData.frequency || 'once',
          createdAt: now,
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove || false,
          recurring: formData.recurring || false,
          percentageChange: formData.percentageChange || 0
        } as PriceAlert;
        break;
      
      case 'volume':
        newAlert = {
          id: uuidv4(),
          type: 'volume',
          coinId: formData.coinId,
          coinName: formData.coinName,
          coinSymbol: formData.coinSymbol,
          enabled: formData.enabled,
          notifyVia: formData.notifyVia,
          frequency: formData.frequency || 'once',
          createdAt: now,
          volumeThreshold: formData.volumeThreshold || 0
        } as VolumeAlert;
        break;
      
      case 'technical':
        newAlert = {
          id: uuidv4(),
          type: 'technical',
          coinId: formData.coinId,
          coinName: formData.coinName,
          coinSymbol: formData.coinSymbol,
          enabled: formData.enabled,
          notifyVia: formData.notifyVia,
          frequency: formData.frequency || 'once',
          createdAt: now,
          indicator: formData.indicator || '',
          condition: formData.condition || '',
          value: formData.value || 0,
          timeframe: formData.timeframe || ''
        } as TechnicalAlert;
        break;
      
      default:
        throw new Error(`Invalid alert type: ${formData.type}`);
    }

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
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
