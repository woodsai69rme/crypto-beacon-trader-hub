
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AlertFormProps {
  formData: {
    coinId: string;
    coinName: string;
    targetPrice: number;
    isAbove: boolean;
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
          onChange={(e) => onFormChange({ 
            ...formData, 
            coinId: e.target.value,
            coinName: e.target.options[e.target.selectedIndex].text 
          })}
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="solana">Solana</option>
          <option value="cardano">Cardano</option>
          <option value="ripple">XRP</option>
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
