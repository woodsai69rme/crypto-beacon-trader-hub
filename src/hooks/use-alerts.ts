
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertData, AlertFormData, PriceAlert, VolumeAlert, TechnicalAlert, AlertFrequency } from '@/types/alerts';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  
  // Load alerts from localStorage
  useEffect(() => {
    try {
      const savedAlerts = localStorage.getItem('cryptoAlerts');
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cryptoAlerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  }, [alerts]);

  // Add a new alert
  const addAlert = useCallback((alertFormData: AlertFormData) => {
    const now = new Date();
    
    // Ensure required fields have default values
    const baseAlert = {
      id: uuidv4(),
      createdAt: now,
      coinId: alertFormData.coinId,
      coinName: alertFormData.coinName,
      coinSymbol: alertFormData.coinSymbol,
      enabled: alertFormData.enabled ?? true,
      frequency: alertFormData.frequency ?? 'once',
      notifyVia: alertFormData.notifyVia ?? ['app'],
    };
    
    // Create type-specific alert
    let newAlert: AlertData;
    
    if (alertFormData.type === 'price') {
      newAlert = {
        ...baseAlert,
        type: 'price',
        targetPrice: alertFormData.targetPrice ?? 0,
        isAbove: alertFormData.isAbove ?? true,
        recurring: alertFormData.recurring ?? false,
        percentageChange: alertFormData.percentageChange ?? 0,
      } as PriceAlert;
    } else if (alertFormData.type === 'volume') {
      newAlert = {
        ...baseAlert,
        type: 'volume',
        volumeThreshold: alertFormData.volumeThreshold ?? 0,
      } as VolumeAlert;
    } else {
      // Technical alert
      newAlert = {
        ...baseAlert,
        type: 'technical',
        indicator: alertFormData.indicator ?? '',
        condition: alertFormData.condition ?? '',
        value: alertFormData.value ?? 0,
      } as TechnicalAlert;
    }
    
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  // Remove an alert
  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // Toggle an alert's enabled status
  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  }, []);

  return {
    alerts,
    addAlert,
    removeAlert,
    toggleAlert
  };
};
