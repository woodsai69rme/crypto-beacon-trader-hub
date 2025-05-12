import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { COIN_OPTIONS } from "./AlertTypes";
import { PriceAlert } from "@/types/alerts";
import { validateFormFields } from "@/utils/formValidation";
import { handleError } from "@/utils/errorHandling";

type AlertFormData = Omit<PriceAlert, 'id' | 'createdAt'>;

interface AlertFormProps {
  formData: AlertFormData;
  onFormChange: (data: AlertFormData) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = validateFormFields(formData, [
        "coinId",
        "coinName",
        "coinSymbol",
        "targetPrice"
      ]);
      
      if (!isValid) {
        return;
      }

      if (formData.targetPrice <= 0) {
        handleError("Price target must be greater than 0", "warning", "Price Alert");
        return;
      }

      onSubmit();
    } catch (error) {
      handleError(error, "error", "Price Alert");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <Label className="text-sm font-medium">Coin</Label>
        <select
          className="rounded border border-border bg-background px-2 py-1 text-foreground"
          value={formData.coinId}
          onChange={(e) => {
            const selectedCoin = COIN_OPTIONS[e.target.value];
            onFormChange({
              ...formData,
              coinId: selectedCoin.id,
              coinName: selectedCoin.name,
              coinSymbol: selectedCoin.symbol
            });
          }}
        >
          {Object.values(COIN_OPTIONS).map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Label className="text-sm font-medium">Alert me when price is</Label>
        <div className="flex items-center space-x-2">
          <select
            className="rounded border border-border bg-background px-2 py-1 text-foreground"
            value={formData.isAbove ? "above" : "below"}
            onChange={(e) => onFormChange({ 
              ...formData, 
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
                className="pl-6"
                value={formData.targetPrice || ""}
                onChange={(e) => onFormChange({ 
                  ...formData, 
                  targetPrice: parseFloat(e.target.value) || 0 
                })}
                placeholder="Enter price"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Add Alert
      </Button>
    </form>
  );
};
