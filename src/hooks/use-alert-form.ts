
import { useState } from 'react';
import { COIN_OPTIONS } from '@/components/widgets/AlertComponents/AlertTypes';
import { PriceAlert } from '@/types/alerts';

const defaultAlert = {
  coinId: "bitcoin",
  coinName: "Bitcoin",
  coinSymbol: "BTC",
  targetPrice: 0,
  isAbove: true,
  enabled: true,
  recurring: false,
  percentageChange: 0,
  notifyVia: ["app"] as ("email" | "app" | "push")[]
};

export const useAlertForm = () => {
  const [formData, setFormData] = useState(defaultAlert);
  
  const resetForm = () => setFormData(defaultAlert);
  
  const updateCoin = (coinId: string) => {
    const selectedCoin = COIN_OPTIONS[coinId];
    setFormData(prev => ({
      ...prev,
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol
    }));
  };
  
  return {
    formData,
    setFormData,
    resetForm,
    updateCoin
  };
};
