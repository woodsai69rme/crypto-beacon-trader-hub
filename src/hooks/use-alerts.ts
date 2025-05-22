
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  AlertData, 
  AlertType, 
  AlertFormData, 
  PriceAlert, 
  VolumeAlert, 
  PatternAlert,
  TechnicalAlert,
  NotificationMethod
} from "@/types/alerts";
import { toast } from "@/components/ui/use-toast";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a new alert
  const createAlert = useCallback((formData: AlertFormData): AlertData => {
    // Create a base alert with common properties
    const baseAlert = {
      id: uuidv4(),
      createdAt: new Date(),
      coinId: formData.coinId,
      coinName: formData.coinName,
      coinSymbol: formData.coinSymbol,
      enabled: formData.enabled,
      notifyVia: formData.notifyVia,
    };

    let newAlert: AlertData;

    // Create specific alert type based on formData.type
    switch (formData.type) {
      case "price":
        newAlert = {
          ...baseAlert,
          type: "price",
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove || false,
          recurring: formData.recurring || false,
          percentageChange: formData.percentageChange || 0,
        } as PriceAlert;
        break;

      case "volume":
        newAlert = {
          ...baseAlert,
          type: "volume",
          volumeThreshold: formData.volumeThreshold || 0,
          frequency: formData.frequency || "24h",
        } as VolumeAlert;
        break;

      case "pattern":
        newAlert = {
          ...baseAlert,
          type: "pattern",
          pattern: formData.pattern || "",
        } as PatternAlert;
        break;

      case "technical":
        newAlert = {
          ...baseAlert,
          type: "technical",
          indicator: formData.indicator || "",
          condition: formData.condition || "",
          value: formData.value || 0,
        } as TechnicalAlert;
        break;

      default:
        throw new Error(`Unsupported alert type: ${formData.type}`);
    }

    // Add the new alert to the state
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);

    toast({
      title: "Alert Created",
      description: `${formData.coinName} alert has been created.`,
    });

    return newAlert;
  }, []);

  // Update an existing alert
  const updateAlert = useCallback((id: string, updates: Partial<AlertData>) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id 
          ? { ...alert, ...updates }
          : alert
      )
    );

    toast({
      title: "Alert Updated",
      description: "Your alert has been updated.",
    });
  }, []);

  // Delete an alert
  const deleteAlert = useCallback((id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));

    toast({
      title: "Alert Deleted",
      description: "Your alert has been deleted.",
    });
  }, []);

  // Get a specific alert by ID
  const getAlertById = useCallback((id: string): AlertData => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }
    return alert;
  }, [alerts]);

  // Filter alerts by type and/or coinId
  const filterAlerts = useCallback((type?: AlertType, coinId?: string): AlertData[] => {
    return alerts.filter(alert => {
      const typeMatch = type ? alert.type === type : true;
      const coinMatch = coinId ? alert.coinId === coinId : true;
      return typeMatch && coinMatch;
    });
  }, [alerts]);

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

export type UseAlertsReturn = ReturnType<typeof useAlerts>;

export default useAlerts;
