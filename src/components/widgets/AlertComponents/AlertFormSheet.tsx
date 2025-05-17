
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { COIN_OPTIONS } from "./AlertTypes";
import { AlertFormData } from "@/types/alerts";

interface AlertFormProps {
  formData: AlertFormData;
  onFormChange: (data: Partial<AlertFormData>) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.coinId) {
      console.error("Coin selection is required");
      return;
    }
    
    if (formData.type === 'price' && (formData.targetPrice === undefined || formData.targetPrice <= 0)) {
      console.error("Price target must be greater than 0");
      return;
    }
    
    if (formData.type === 'volume' && (formData.volumeThreshold === undefined || formData.volumeThreshold <= 0)) {
      console.error("Volume threshold must be greater than 0");
      return;
    }
    
    if (formData.type === 'technical' && (!formData.indicator || !formData.condition || formData.value === undefined)) {
      console.error("Technical indicator, condition, and value are all required");
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <Label className="text-sm font-medium">Coin</Label>
        <select
          className="rounded border border-border bg-background px-2 py-1 text-foreground"
          value={formData.coinId || ''}
          onChange={(e) => {
            const selectedCoin = COIN_OPTIONS.find(coin => coin.id === e.target.value);
            if (selectedCoin) {
              onFormChange({
                coinId: selectedCoin.id,
                coinName: selectedCoin.name,
                coinSymbol: selectedCoin.symbol
              });
            }
          }}
        >
          <option value="" disabled>Select a coin</option>
          {COIN_OPTIONS.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
      </div>
      
      {formData.type === 'price' && (
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium">Alert me when price is</Label>
          <div className="flex items-center space-x-2">
            <select
              className="rounded border border-border bg-background px-2 py-1 text-foreground"
              value={formData.isAbove ? "above" : "below"}
              onChange={(e) => onFormChange({ 
                isAbove: e.target.value === "above"
              })}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  className="pl-6"
                  value={formData.targetPrice || ""}
                  onChange={(e) => onFormChange({ 
                    targetPrice: parseFloat(e.target.value) || 0 
                  })}
                  placeholder="Enter price"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Button type="submit" className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Add Alert
      </Button>
    </form>
  );
};
