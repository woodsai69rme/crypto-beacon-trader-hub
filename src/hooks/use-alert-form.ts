
import { useState } from 'react';
import { AlertFormData, AlertFrequency } from '@/types/alerts';

export const useAlertForm = (initialType: 'price' | 'volume' | 'technical' = 'price') => {
  const [formData, setFormData] = useState<AlertFormData>({
    type: initialType,
    coinId: '',
    coinName: '',
    coinSymbol: '',
    enabled: true,
    notifyVia: ['app'],
    frequency: 'once' as AlertFrequency,
    // Price alert specific fields
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    percentageChange: 0,
    // Volume alert specific fields
    volumeThreshold: 0,
    // Technical alert specific fields
    indicator: '',
    condition: '',
    value: 0
  });

  const updateFormData = (data: Partial<AlertFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      type: initialType,
      coinId: '',
      coinName: '',
      coinSymbol: '',
      enabled: true,
      notifyVia: ['app'],
      frequency: 'once',
      targetPrice: 0,
      isAbove: true,
      recurring: false,
      percentageChange: 0,
      volumeThreshold: 0,
      indicator: '',
      condition: '',
      value: 0
    });
  };

  return {
    formData,
    updateFormData,
    resetForm,
    setFormData
  };
};
