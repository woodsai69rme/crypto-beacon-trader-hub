
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from '@/contexts/CurrencyContext';
import { SupportedCurrency } from '@/types/trading';

interface CurrencySelectorProps {
  onChange?: (currency: SupportedCurrency) => void;
  disabled?: boolean;
  className?: string;
  useActiveCurrency?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  onChange,
  disabled = false,
  className = "",
  useActiveCurrency = false
}) => {
  const { currency, setCurrency, activeCurrency, setActiveCurrency } = useCurrency();
  
  const currentCurrency = useActiveCurrency ? activeCurrency : currency;
  const setCurrencyValue = useActiveCurrency ? setActiveCurrency : setCurrency;
  
  const handleCurrencyChange = (value: SupportedCurrency) => {
    setCurrencyValue(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <Select
      value={currentCurrency}
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
        <SelectItem value="JPY">JPY</SelectItem>
        <SelectItem value="CAD">CAD</SelectItem>
        <SelectItem value="CHF">CHF</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
