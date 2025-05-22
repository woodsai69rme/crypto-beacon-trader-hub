
import { useState, useEffect } from 'react';
import { Alert, AlertFormData, AlertType } from '@/types/alerts';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

// Mock function to mimic API calls
const mockSaveAlert = async (alert: Alert): Promise<Alert> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(alert);
    }, 300);
  });
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load saved alerts on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('crypto_alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (err) {
        console.error('Error loading saved alerts:', err);
        setError(err instanceof Error ? err : new Error('Error loading alerts'));
      }
    }
  }, []);

  // Save alerts to local storage when they change
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('crypto_alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  // Create a new alert
  const createAlert = async (data: AlertFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newAlertBase = {
        id: uuidv4(),
        type: data.type,
        coinId: data.coinId,
        coinName: data.coinName,
        coinSymbol: data.coinSymbol,
        enabled: data.enabled,
        notifyVia: data.notifyVia,
        createdAt: new Date(),
      };

      let newAlert: Alert;

      // Create the specific alert type
      switch (data.type) {
        case 'price':
          newAlert = {
            ...newAlertBase,
            type: 'price',
            targetPrice: data.targetPrice || 0,
            isAbove: data.isAbove || false,
            recurring: data.recurring || false,
            percentageChange: data.percentageChange,
          };
          break;
        case 'volume':
          newAlert = {
            ...newAlertBase,
            type: 'volume',
            targetVolume: data.targetVolume || 0,
            isAbove: data.isAbove || false,
          };
          break;
        case 'pattern':
          newAlert = {
            ...newAlertBase,
            type: 'pattern',
            pattern: data.pattern || '',
          };
          break;
        case 'technical':
          newAlert = {
            ...newAlertBase,
            type: 'technical',
            indicator: data.indicator || '',
            threshold: data.threshold || 0,
          };
          break;
        default:
          throw new Error(`Unsupported alert type: ${data.type}`);
      }

      // Call the API (mock)
      const savedAlert = await mockSaveAlert(newAlert);
      setAlerts((prev) => [...prev, savedAlert]);

      toast({
        title: 'Alert Created',
        description: `Alert for ${data.coinName} has been created.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating alert'));
      
      toast({
        title: 'Error',
        description: 'Failed to create alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete an alert
  const deleteAlert = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, make an API call here
      const filteredAlerts = alerts.filter((alert) => alert.id !== id);
      setAlerts(filteredAlerts);
      
      if (filteredAlerts.length === 0) {
        localStorage.removeItem('crypto_alerts');
      } else {
        localStorage.setItem('crypto_alerts', JSON.stringify(filteredAlerts));
      }

      toast({
        title: 'Alert Deleted',
        description: 'The alert has been deleted successfully.',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error deleting alert'));
      
      toast({
        title: 'Error',
        description: 'Failed to delete alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle an alert's enabled state
  const toggleAlert = async (id: string, enabled: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const updatedAlerts = alerts.map((alert) =>
        alert.id === id ? { ...alert, enabled } : alert
      );
      
      setAlerts(updatedAlerts);
      localStorage.setItem('crypto_alerts', JSON.stringify(updatedAlerts));

      toast({
        title: enabled ? 'Alert Enabled' : 'Alert Disabled',
        description: `The alert has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating alert'));
      
      toast({
        title: 'Error',
        description: 'Failed to update alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts,
    loading,
    error,
    createAlert,
    deleteAlert,
    toggleAlert,
  };
}
