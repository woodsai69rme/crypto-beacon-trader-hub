
import { useState } from 'react';
import { PriceAlertFormData } from '@/components/widgets/AlertComponents/AlertTypes';

export function useAlertForm() {
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    percentageChange: 0,
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
      percentageChange: 0,
      enabled: true,
      notifyVia: ['app']
    });
  };

  return {
    formData,
    setFormData,
    resetForm
  };
}
