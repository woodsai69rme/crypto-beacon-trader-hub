
import { useState } from 'react';
import { COIN_OPTIONS } from '@/components/widgets/AlertComponents/AlertTypes';
// Import the types from alerts.ts instead of trading.ts
import { AlertFormData, AlertFrequency } from '@/types/alerts';

const defaultAlert: Partial<AlertFormData> = {
  coinId: "bitcoin",
  coinName: "Bitcoin",
  coinSymbol: "BTC",
  targetPrice: 0,
  type: 'price',
  frequency: 'once' as AlertFrequency,
  isAbove: true,
  enabled: true,
  recurring: false,
  percentageChange: 0,
  notifyVia: ["app"] as ("email" | "app" | "push")[]
};

export const useAlertForm = () => {
  const [formData, setFormData] = useState<Partial<AlertFormData>>(defaultAlert);
  
  const resetForm = () => setFormData(defaultAlert);
  
  const updateCoin = (coinId: string) => {
    const selectedCoin = COIN_OPTIONS.find(coin => coin.id === coinId);
    if (selectedCoin) {
      setFormData(prev => ({
        ...prev,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol
      }));
    }
  };
  
  return {
    formData,
    setFormData,
    resetForm,
    updateCoin
  };
};
