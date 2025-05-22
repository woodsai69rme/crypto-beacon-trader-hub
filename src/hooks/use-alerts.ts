
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  AlertData, 
  AlertFormData, 
  PriceAlert, 
  VolumeAlert, 
  TechnicalAlert,
  AlertType
} from '@/types/alerts';
import { toast } from '@/components/ui/use-toast';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const loadAlerts = () => {
      try {
        const savedAlerts = localStorage.getItem('crypto-alerts');
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts));
        }
      } catch (error) {
        console.error('Failed to load alerts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your alerts',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('crypto-alerts', JSON.stringify(alerts));
      } catch (error) {
        console.error('Failed to save alerts:', error);
      }
    }
  }, [alerts, isLoading]);

  const createAlert = (formData: AlertFormData): AlertData => {
    const baseAlert = {
      id: uuidv4(),
      coinId: formData.coinId,
      coinName: formData.coinName,
      coinSymbol: formData.coinSymbol,
      enabled: formData.enabled,
      notifyVia: formData.notifyVia || ['app'],
      frequency: formData.frequency || 'once',
      createdAt: new Date().toISOString(),
    };

    let newAlert: AlertData;

    switch (formData.type) {
      case 'price':
        newAlert = {
          ...baseAlert,
          type: 'price',
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove ?? true,
          recurring: formData.recurring ?? false,
          percentageChange: formData.percentageChange || 0,
        } as PriceAlert;
        break;
      case 'volume':
        newAlert = {
          ...baseAlert,
          type: 'volume',
          volumeThreshold: formData.volumeThreshold || 0,
        } as VolumeAlert;
        break;
      case 'technical':
        newAlert = {
          ...baseAlert,
          type: 'technical',
          indicator: formData.indicator || '',
          condition: formData.condition || '',
          value: formData.value || 0,
          timeframe: formData.timeframe || '1d',
        } as TechnicalAlert;
        break;
      default:
        throw new Error(`Unknown alert type: ${formData.type}`);
    }

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    
    return newAlert;
  };

  const updateAlert = (id: string, updates: Partial<AlertData>) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, ...updates } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const getAlertById = (id: string): AlertData | undefined => {
    return alerts.find((alert) => alert.id === id);
  };

  const filterAlerts = (type?: AlertType, coinId?: string): AlertData[] => {
    return alerts.filter(
      (alert) => 
        (!type || alert.type === type) && 
        (!coinId || alert.coinId === coinId)
    );
  };

  return {
    alerts,
    isLoading,
    createAlert,
    updateAlert,
    deleteAlert,
    getAlertById,
    filterAlerts,
  };
};

export default useAlerts;
