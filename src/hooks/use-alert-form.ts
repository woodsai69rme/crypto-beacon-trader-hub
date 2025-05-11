
import { useState } from 'react';

// Define a type for the form data
export interface AlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange: number;
  enabled: boolean;
  notifyVia: ("email" | "app" | "push")[];
}

// Default form values
const defaultFormData: AlertFormData = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'BTC',
  targetPrice: 0,
  isAbove: true,
  recurring: false,
  percentageChange: 5,
  enabled: true,
  notifyVia: ['app']
};

export function useAlertForm() {
  const [formData, setFormData] = useState<AlertFormData>(defaultFormData);
  
  const updateFormField = <K extends keyof AlertFormData>(
    field: K, 
    value: AlertFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const resetForm = () => {
    setFormData(defaultFormData);
  };
  
  return {
    formData,
    setFormData,
    updateFormField,
    resetForm
  };
}

export default useAlertForm;
