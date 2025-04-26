
import { useState, useEffect } from "react";
import { PriceAlert, VolumeAlert } from "@/types/alerts";
import { toast } from "@/components/ui/use-toast";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [volumeAlerts, setVolumeAlerts] = useState<VolumeAlert[]>([]);

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem("priceAlerts");
    const savedVolumeAlerts = localStorage.getItem("volumeAlerts");
    
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error("Failed to load alerts:", error);
      }
    }
    
    if (savedVolumeAlerts) {
      try {
        setVolumeAlerts(JSON.parse(savedVolumeAlerts));
      } catch (error) {
        console.error("Failed to load volume alerts:", error);
      }
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("priceAlerts", JSON.stringify(alerts));
    localStorage.setItem("volumeAlerts", JSON.stringify(volumeAlerts));
  }, [alerts, volumeAlerts]);

  const addAlert = (newAlert: Omit<PriceAlert, "id" | "createdAt">) => {
    const alert: PriceAlert = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...newAlert,
    };
    
    setAlerts([...alerts, alert]);
    
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${alert.coinName} is ${alert.isAbove ? "above" : "below"} $${alert.targetPrice.toLocaleString()}`,
    });
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Price alert has been removed",
    });
  };

  return {
    alerts,
    volumeAlerts,
    addAlert,
    removeAlert,
  };
};
