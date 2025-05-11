
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { PriceAlertFormData } from '@/components/widgets/AlertComponents/AlertTypes';

export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  createdAt: string;
  enabled: boolean;
  notifyVia: string[];
}

const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const addAlert = useCallback((formData: PriceAlertFormData) => {
    const newAlert: Alert = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    setAlerts((currentAlerts) => [...currentAlerts, newAlert]);
    
    toast({
      title: 'Alert Created',
      description: `You will be notified when ${formData.coinSymbol} is ${formData.isAbove ? 'above' : 'below'} $${formData.targetPrice.toLocaleString()}`,
    });
    
    return newAlert;
  }, []);
  
  const removeAlert = useCallback((id: string) => {
    setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== id));
    
    toast({
      title: 'Alert Removed',
      description: 'The price alert has been removed',
    });
  }, []);
  
  const toggleAlert = useCallback((id: string) => {
    setAlerts((currentAlerts) => 
      currentAlerts.map((alert) => 
        alert.id === id 
          ? { ...alert, enabled: !alert.enabled } 
          : alert
      )
    );
  }, []);
  
  const checkAlerts = useCallback((coinId: string, currentPrice: number) => {
    const triggeredAlerts: Alert[] = [];
    
    setAlerts((currentAlerts) => {
      const updatedAlerts = currentAlerts.map((alert) => {
        if (
          alert.coinId === coinId && 
          alert.enabled && 
          ((alert.isAbove && currentPrice >= alert.targetPrice) || 
           (!alert.isAbove && currentPrice <= alert.targetPrice))
        ) {
          triggeredAlerts.push(alert);
          
          // If not recurring, disable the alert
          if (!alert.recurring) {
            return { ...alert, enabled: false };
          }
        }
        return alert;
      });
      
      return updatedAlerts;
    });
    
    // Display notifications for triggered alerts
    triggeredAlerts.forEach((alert) => {
      toast({
        title: 'Price Alert Triggered',
        description: `${alert.coinName} is now ${alert.isAbove ? 'above' : 'below'} $${alert.targetPrice.toLocaleString()}`,
        variant: 'destructive',
      });
    });
    
    return triggeredAlerts;
  }, []);
  
  return {
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    checkAlerts
  };
};

export default useAlerts;
