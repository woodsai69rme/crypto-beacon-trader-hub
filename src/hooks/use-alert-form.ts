
import { useState } from 'react';
import { PriceAlertFormData } from '@/components/widgets/AlertComponents/AlertTypes';

export const useAlertForm = () => {
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: '',
    coinName: '',
    coinSymbol: '',
    isAbove: true,
    targetPrice: 0,
  });

  const resetForm = () => {
    setFormData({
      coinId: '',
      coinName: '',
      coinSymbol: '',
      isAbove: true,
      targetPrice: 0,
    });
  };

  return {
    formData,
    setFormData,
    resetForm,
  };
};
