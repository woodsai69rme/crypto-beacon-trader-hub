
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { SupportedCurrency } from "@/types/trading";

interface CurrencySelectorProps {
  activeCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  variant?: 'default' | 'outline' | 'minimal';
  size?: 'default' | 'sm';
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  activeCurrency, 
  onCurrencyChange, 
  variant = 'default',
  size = 'default'
}) => {
  const getButtonVariant = () => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'minimal':
        return 'ghost';
      default:
        return 'secondary';
    }
  };

  const getButtonSize = () => {
    return size === 'sm' ? 'sm' : 'default';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={getButtonVariant()} size={getButtonSize()} className="gap-1">
          {activeCurrency}
          <ChevronDown className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]" align="end">
        <Tabs defaultValue={activeCurrency} onValueChange={(value) => onCurrencyChange(value as SupportedCurrency)}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="USD">USD</TabsTrigger>
            <TabsTrigger value="EUR">EUR</TabsTrigger>
            <TabsTrigger value="GBP">GBP</TabsTrigger>
            <TabsTrigger value="AUD">AUD</TabsTrigger>
          </TabsList>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelector;
