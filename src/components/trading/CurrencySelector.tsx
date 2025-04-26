
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencySelectorProps {
  activeCurrency: 'USD' | 'AUD';
  onCurrencyChange: (currency: 'USD' | 'AUD') => void;
}

const CurrencySelector = ({ activeCurrency, onCurrencyChange }: CurrencySelectorProps) => {
  return (
    <Select value={activeCurrency} onValueChange={(val) => onCurrencyChange(val as 'USD' | 'AUD')}>
      <SelectTrigger className="w-24 h-8 text-xs">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="AUD">AUD</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
