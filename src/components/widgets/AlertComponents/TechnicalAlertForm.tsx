
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TechnicalAlertFormData, COIN_OPTIONS } from "./AlertTypes";
import { validateFormFields } from "@/utils/formValidation";
import { handleError } from "@/utils/errorHandling";

interface TechnicalAlertFormProps {
  formData: TechnicalAlertFormData;
  setFormData: (data: TechnicalAlertFormData) => void;
  onSubmit: () => void;
}

const TechnicalAlertForm: React.FC<TechnicalAlertFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = validateFormFields(formData, [
        "coinId",
        "indicator",
        "condition",
        "value"
      ]);
      
      if (!isValid) {
        return;
      }

      if (formData.value <= 0) {
        handleError("Value must be greater than 0", "warning", "Technical Alert");
        return;
      }

      onSubmit();
    } catch (error) {
      handleError(error, "error", "Technical Alert");
    }
  };

  const handleCoinChange = (value: string) => {
    const coin = COIN_OPTIONS[value];
    setFormData({
      ...formData,
      coinId: value,
      coinName: coin.name,
      coinSymbol: coin.symbol
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Coin</label>
              <Select 
                value={formData.coinId}
                onValueChange={handleCoinChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                  <SelectItem value="ripple">XRP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Indicator</label>
              <Select
                value={formData.indicator}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  indicator: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RSI">RSI</SelectItem>
                  <SelectItem value="MACD">MACD</SelectItem>
                  <SelectItem value="Bollinger Bands">Bollinger Bands</SelectItem>
                  <SelectItem value="Moving Average">Moving Average</SelectItem>
                  <SelectItem value="Stochastic">Stochastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    condition: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                    <SelectItem value="crosses above">Crosses Above</SelectItem>
                    <SelectItem value="crosses below">Crosses Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  type="number"
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    value: parseFloat(e.target.value) || 0 
                  })}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="mr-1 h-4 w-4" />
              Add Technical Alert
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TechnicalAlertForm;
