
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { SupportedCurrency } from "./TradingStats";

interface CurrencySelectorProps {
  activeCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  disabled?: boolean;
  className?: string;
}

const CURRENCY_NAMES = {
  USD: "US Dollar",
  AUD: "Australian Dollar",
  EUR: "Euro",
  GBP: "British Pound"
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  AUD: "A$",
  EUR: "€",
  GBP: "£"
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
      onValueChange={(val) => onCurrencyChange(val as SupportedCurrency)}
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
        {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center">
              <span className="currency-symbol mr-2">{CURRENCY_SYMBOLS[code as SupportedCurrency]}</span>
              <span>{code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
