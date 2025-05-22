
import { useState } from 'react';
import { AlertFormData, AlertType, NotificationMethod } from '@/types/alerts';

interface AlertFormHook {
  formData: Partial<AlertFormData>;
  setFormData: (data: Partial<AlertFormData>) => void;
  updateField: (field: keyof AlertFormData, value: any) => void;
  resetForm: () => void;
}

const defaultFormData: Partial<AlertFormData> = {
  type: 'price',
  enabled: true,
  notifyVia: ['app'],
  isAbove: true,
  recurring: false,
};

export function useAlertForm(): AlertFormHook {
  const [formData, setFormData] = useState<Partial<AlertFormData>>(defaultFormData);

  const updateField = (field: keyof AlertFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
  };
}
