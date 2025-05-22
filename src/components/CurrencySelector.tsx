
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from '@/contexts/CurrencyContext';
import { SupportedCurrency } from '@/types/trading';

interface CurrencySelectorProps {
  onChange?: (currency: SupportedCurrency) => void;
  disabled?: boolean;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  onChange,
  disabled = false,
  className = ""
}) => {
  const { currency, setCurrency } = useCurrency();
  
  const handleCurrencyChange = (value: SupportedCurrency) => {
    setCurrency(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <Select
      value={currency}
      onValueChange={handleCurrencyChange as (value: string) => void}
      disabled={disabled}
    >
      <SelectTrigger className={`w-24 ${className}`}>
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AUD">AUD</SelectItem>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="EUR">EUR</SelectItem>
        <SelectItem value="GBP">GBP</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
