
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { COIN_OPTIONS } from "./AlertTypes";

interface AlertFormProps {
  formData: {
    coinId: string;
    coinName: string;
    coinSymbol: string;
    targetPrice: number;
    isAbove: boolean;
    enabled: boolean;
    recurring: boolean;
    percentageChange: number;
    notifyVia: ("email" | "app" | "push")[];
  };
  onFormChange: (data: any) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
}) => {
  return (
    <div className="mt-4 space-y-4">
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
      
      <Button className="w-full" onClick={onSubmit}>
        <Plus className="mr-1 h-4 w-4" />
        Add Alert
      </Button>
    </div>
  );
};
