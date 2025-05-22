
import { useState } from "react";
import { AlertFormData, AlertType, NotificationMethod } from "@/types/alerts";

const defaultAlertFormData: AlertFormData = {
  type: "price",
  coinId: "",
  coinName: "",
  coinSymbol: "",
  enabled: true,
  notifyVia: ["app"],
  targetPrice: 0,
  isAbove: true,
  recurring: false,
  percentageChange: 0,
  volumeThreshold: 0,
  frequency: "24h",
  indicator: "",
  condition: "",
  value: 0,
  pattern: ""
};

export const useAlertForm = (initialData: Partial<AlertFormData> = {}) => {
  const [formData, setFormData] = useState<AlertFormData>({
    ...defaultAlertFormData,
    ...initialData
  });

  const resetForm = () => {
    setFormData(defaultAlertFormData);
  };

  const updateFormField = <K extends keyof AlertFormData>(
    field: K,
    value: AlertFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    setFormData,
    resetForm,
    updateFormField
  };
};

export default useAlertForm;
