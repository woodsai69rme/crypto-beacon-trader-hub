
import { useState } from 'react';
import { Alert, AlertFormData, AlertType } from '@/types/alerts';
import { v4 as uuidv4 } from 'uuid';

interface AlertHook {
  alerts: Alert[];
  createAlert: (formData: AlertFormData) => void;
  deleteAlert: (alertId: string) => void;
  getAlertById: (alertId: string) => Alert | undefined;
  getAlertsByType: (type: AlertType) => Alert[];
}

export function useAlerts(): AlertHook {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const createAlert = (formData: AlertFormData) => {
    const now = new Date();

    // Create alert based on the type
    let newAlert: Alert;
    
    switch (formData.type) {
      case 'price':
        newAlert = {
          id: uuidv4(),
          type: 'price',
          coinId: formData.coinId || '',
          coinName: formData.coinName || '',
          coinSymbol: formData.coinSymbol || '',
          enabled: formData.enabled || true,
          notifyVia: formData.notifyVia || ['app'],
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove || true,
          recurring: formData.recurring || false,
          percentageChange: formData.percentageChange,
          createdAt: now,
        };
        break;
      
      case 'volume':
        newAlert = {
          id: uuidv4(),
          type: 'volume',
          coinId: formData.coinId || '',
          coinName: formData.coinName || '',
          coinSymbol: formData.coinSymbol || '',
          enabled: formData.enabled || true,
          notifyVia: formData.notifyVia || ['app'],
          targetVolume: formData.targetVolume || 0,
          isAbove: formData.isAbove || true,
          createdAt: now,
        };
        break;
      
      case 'pattern':
        newAlert = {
          id: uuidv4(),
          type: 'pattern',
          coinId: formData.coinId || '',
          coinName: formData.coinName || '',
          coinSymbol: formData.coinSymbol || '',
          enabled: formData.enabled || true,
          notifyVia: formData.notifyVia || ['app'],
          pattern: formData.pattern || '',
          createdAt: now,
        };
        break;
      
      case 'technical':
        newAlert = {
          id: uuidv4(),
          type: 'technical',
          coinId: formData.coinId || '',
          coinName: formData.coinName || '',
          coinSymbol: formData.coinSymbol || '',
          enabled: formData.enabled || true,
          notifyVia: formData.notifyVia || ['app'],
          indicator: formData.indicator || '',
          threshold: formData.threshold || 0,
          createdAt: now,
        };
        break;
        
      default:
        // Default to price alert if type is invalid
        newAlert = {
          id: uuidv4(),
          type: 'price',
          coinId: formData.coinId || '',
          coinName: formData.coinName || '',
          coinSymbol: formData.coinSymbol || '',
          enabled: formData.enabled || true,
          notifyVia: formData.notifyVia || ['app'],
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove || true,
          recurring: formData.recurring || false,
          createdAt: now,
        };
    }
    
    setAlerts([...alerts, newAlert]);
    
    // For demo purposes, let's trigger a notification
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // Check if we have notification permission
        if (Notification.permission === 'granted') {
          new Notification('Alert Created', {
            body: `Alert created for ${newAlert.coinName}`,
          });
        }
      }, 1000);
    }
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertById = (alertId: string) => {
    return alerts.find(alert => alert.id === alertId);
  };

  const getAlertsByType = (type: AlertType) => {
    return alerts.filter(alert => alert.type === type);
  };

  return {
    alerts,
    createAlert,
    deleteAlert,
    getAlertById,
    getAlertsByType,
  };
}
