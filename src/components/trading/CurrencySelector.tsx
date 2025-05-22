
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export interface CurrencySelectorProps {
  activeCurrency: string;
  onCurrencyChange: (currency: string) => void;
  disabled?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  activeCurrency, 
  onCurrencyChange,
  disabled = false
}) => {
  const currencies = ["AUD", "USD", "EUR", "GBP", "CAD", "JPY", "CNY", "BTC", "ETH"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-20" 
          disabled={disabled}
        >
          {activeCurrency} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem 
            key={currency}
            className={`${activeCurrency === currency ? 'bg-accent' : ''}`}
            onClick={() => onCurrencyChange(currency)}
          >
            {currency}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
