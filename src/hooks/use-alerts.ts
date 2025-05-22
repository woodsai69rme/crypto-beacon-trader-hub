
import { useState, useEffect } from "react";
import { PriceAlert, VolumeAlert, AlertData, AlertFormData } from "@/types/trading";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/errorHandling";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [volumeAlerts, setVolumeAlerts] = useState<VolumeAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load alerts from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedAlerts = localStorage.getItem("priceAlerts");
      const savedVolumeAlerts = localStorage.getItem("volumeAlerts");
      
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
      
      if (savedVolumeAlerts) {
        setVolumeAlerts(JSON.parse(savedVolumeAlerts));
      }
    } catch (error) {
      handleError(error, "warning", "Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("priceAlerts", JSON.stringify(alerts));
        localStorage.setItem("volumeAlerts", JSON.stringify(volumeAlerts));
      } catch (error) {
        handleError(error, "warning", "Failed to save alerts");
      }
    }
  }, [alerts, volumeAlerts, isLoading]);

  const addAlert = async (newAlertData: AlertFormData) => {
    try {
      // Validate required fields
      if (!newAlertData.coinId || !newAlertData.coinName || !newAlertData.coinSymbol || !newAlertData.type || !newAlertData.frequency) {
        throw new Error("Missing required alert information");
      }

      const alert: AlertData = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...newAlertData,
        enabled: true,
      } as AlertData;
      
      setAlerts(prevAlerts => [...prevAlerts, alert]);
      
      return alert;
    } catch (error) {
      handleError(error, "error", "Add Alert");
      throw error;
    }
  };

  const removeAlert = async (id: string) => {
    try {
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
      return true;
    } catch (error) {
      handleError(error, "error", "Remove Alert");
      throw error;
    }
  };
  
  const updateAlert = async (id: string, updatedData: Partial<AlertData>) => {
    try {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === id ? { ...alert, ...updatedData } : alert
        )
      );
      return true;
    } catch (error) {
      handleError(error, "error", "Update Alert");
      throw error;
    }
  };
  
  const toggleAlertEnabled = async (id: string) => {
    try {
      const alert = alerts.find(a => a.id === id);
      if (!alert) throw new Error("Alert not found");
      
      await updateAlert(id, { enabled: !alert.enabled });
      return !alert.enabled;
    } catch (error) {
      handleError(error, "error", "Toggle Alert");
      throw error;
    }
  };

  return {
    alerts,
    volumeAlerts,
    addAlert,
    removeAlert,
    updateAlert,
    toggleAlertEnabled,
    isLoading
  };
};
