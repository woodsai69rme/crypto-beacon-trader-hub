import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Alert {
  id: string;
  coinId: string;
  threshold: number;
  type: 'above' | 'below';
  enabled: boolean;
}

const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    // Load alerts from local storage or an API
    const storedAlerts = localStorage.getItem('alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);
  
  useEffect(() => {
    // Save alerts to local storage whenever they change
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);
  
  const createAlert = async (alertData) => {
    try {
      // API call to create alert would go here
      toast({
        title: "Alert Created",
        description: "Your price alert has been set successfully"
      });
      
      const newAlert = {
        id: `alert-${Date.now()}`,
        ...alertData,
        enabled: true
      };
      setAlerts(prev => [...prev, newAlert]);
      
      return newAlert;
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const updateAlert = async (alertId, updatedData) => {
    try {
      // API call to update alert would go here
      toast({
        title: "Alert Updated",
        description: "Your alert has been updated successfully"
      });
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, ...updatedData } : alert
        )
      );
    } catch (error) {
      console.error("Error updating alert:", error);
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const deleteAlert = async (alertId) => {
    try {
      // API call to delete alert would go here
      toast({
        title: "Alert Deleted",
        description: "Your alert has been removed"
      });
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const pauseAlert = async (alertId) => {
    try {
      // API call to pause alert would go here
      toast({
        title: "Alert Paused",
        description: "Your alert has been paused"
      });
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, enabled: false } : alert
        )
      );
    } catch (error) {
      console.error("Error pausing alert:", error);
      toast({
        title: "Error",
        description: "Failed to pause alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resumeAlert = async (alertId) => {
    try {
      // API call to resume alert would go here
      toast({
        title: "Alert Resumed",
        description: "Your alert is now active"
      });
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, enabled: true } : alert
        )
      );
    } catch (error) {
      console.error("Error resuming alert:", error);
      toast({
        title: "Error",
        description: "Failed to resume alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return {
    alerts,
    createAlert,
    updateAlert,
    deleteAlert,
    pauseAlert,
    resumeAlert
  };
};

export default useAlerts;
