
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface CurrencySelectorProps {
  activeCurrency: 'USD' | 'AUD' | string;
  onCurrencyChange: (currency: 'USD' | 'AUD') => void;
  disabled?: boolean;
  className?: string;
}

const CURRENCY_NAMES = {
  USD: "US Dollar",
  AUD: "Australian Dollar"
};

const CurrencySelector = ({ 
  activeCurrency, 
  onCurrencyChange,
  disabled = false,
  className = "" 
}: CurrencySelectorProps) => {
  return (
    <Select 
      value={activeCurrency} 
      onValueChange={(val) => onCurrencyChange(val as 'USD' | 'AUD')}
      disabled={disabled}
    >
      <SelectTrigger 
        className={`w-[130px] h-9 text-sm border-border ${className}`}
        aria-label="Select currency"
      >
        <DollarSign className="w-4 h-4 mr-1" />
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">
          <div className="flex items-center">
            <span className="currency-symbol mr-2">$</span>
            <span>USD</span>
          </div>
        </SelectItem>
        <SelectItem value="AUD">
          <div className="flex items-center">
            <span className="currency-symbol mr-2">A$</span>
            <span>AUD</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
