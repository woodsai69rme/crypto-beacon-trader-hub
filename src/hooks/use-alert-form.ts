
import { useState } from 'react';
import { PriceAlertFormData } from '@/components/widgets/AlertComponents/AlertTypes';

export const useAlertForm = () => {
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    enabled: true,
    notifyVia: ['app']
  });
  
  const resetForm = () => {
    setFormData({
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      targetPrice: 0,
      isAbove: true,
      recurring: false,
      enabled: true,
      notifyVia: ['app']
    });
  };
  
  return {
    formData,
    setFormData,
    resetForm
  };
};
