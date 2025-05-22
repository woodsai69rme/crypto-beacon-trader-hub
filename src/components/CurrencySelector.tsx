
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  onChange?: (currency: string) => void;
  disabled?: boolean;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  onChange,
  disabled = false,
  className = ""
}) => {
  const { activeCurrency, setActiveCurrency } = useCurrency();
  
  const handleCurrencyChange = (value: string) => {
    setActiveCurrency(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <Select
      value={activeCurrency}
      onValueChange={handleCurrencyChange}
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
