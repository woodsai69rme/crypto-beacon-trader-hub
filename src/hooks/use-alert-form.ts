
import { useState } from 'react';
import { PriceAlertFormData } from '@/types/trading';

// Default form data
const defaultFormData: PriceAlertFormData = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'BTC',
  targetPrice: 55000,
  currentPrice: 51234.78,
  isAbove: true,
  notifyVia: ['app'],
  recurring: false,
};

export const useAlertForm = () => {
  const [formData, setFormData] = useState<PriceAlertFormData>(defaultFormData);
  
  // Reset form to default values
  const resetForm = () => {
    setFormData(defaultFormData);
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.coinId) return false;
    if (!formData.targetPrice || isNaN(formData.targetPrice)) return false;
    if (!formData.notifyVia || formData.notifyVia.length === 0) return false;
    
    return true;
  };
  
  return {
    formData,
    setFormData,
    resetForm,
    validateForm,
  };
};
