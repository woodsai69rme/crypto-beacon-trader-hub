
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TechnicalAlertFormData, COIN_OPTIONS } from "./AlertTypes";
import { validateFormFields, createNumberRangeRule } from "@/utils/formValidation";
import { handleError } from "@/utils/errorHandling";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/loading-skeleton";

interface TechnicalAlertFormProps {
  formData: TechnicalAlertFormData;
  setFormData: (data: TechnicalAlertFormData) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const INDICATOR_DESCRIPTIONS: Record<string, string> = {
  "RSI": "Relative Strength Index - measures momentum on a scale of 0-100. Values over 70 indicate overbought conditions, while values under 30 indicate oversold conditions.",
  "MACD": "Moving Average Convergence Divergence - shows the relationship between two moving averages of a security's price.",
  "Bollinger Bands": "Bollinger Bands - consists of a middle band being a moving average, and two outer bands that are standard deviations away from the middle band.",
  "Moving Average": "Moving Average - smooths out price data to create a single flowing line, making it easier to identify the direction of the trend.",
  "Stochastic": "Stochastic Oscillator - compares a particular closing price of a security to a range of its prices over a certain period of time."
};

const CONDITION_DESCRIPTIONS: Record<string, string> = {
  "above": "Alert triggers when indicator value moves above the specified threshold",
  "below": "Alert triggers when indicator value moves below the specified threshold",
  "crosses above": "Alert triggers when indicator value crosses from below to above the specified threshold",
  "crosses below": "Alert triggers when indicator value crosses from above to below the specified threshold"
};

const VALUE_RANGES: Record<string, {min: number, max: number, default: number}> = {
  "RSI": { min: 0, max: 100, default: 70 },
  "MACD": { min: -100, max: 100, default: 0 },
  "Bollinger Bands": { min: 0, max: 3, default: 2 },
  "Moving Average": { min: 1, max: 500, default: 50 },
  "Stochastic": { min: 0, max: 100, default: 80 }
};

const TechnicalAlertForm: React.FC<TechnicalAlertFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit,
  isLoading = false
}) => {
  const [tooltipText, setTooltipText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic field validation
      const isValid = validateFormFields(
        formData,
        ["coinId", "indicator", "condition", "value"],
        {
          value: [
            createNumberRangeRule(
              VALUE_RANGES[formData.indicator]?.min,
              VALUE_RANGES[formData.indicator]?.max
            )
          ]
        }
      );
      
      if (!isValid) {
        return;
      }

      toast({
        title: "Technical Alert Created",
        description: `${formData.coinSymbol} alert will trigger when ${formData.indicator} is ${formData.condition} ${formData.value}`,
      });

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
  
  const handleIndicatorChange = (value: string) => {
    setFormData({ 
      ...formData, 
      indicator: value,
      // Set a sensible default value based on the indicator
      value: VALUE_RANGES[value]?.default || 0
    });
    setTooltipText(INDICATOR_DESCRIPTIONS[value] || "");
  };
  
  const handleConditionChange = (value: string) => {
    setFormData({ 
      ...formData, 
      condition: value 
    });
    setTooltipText(CONDITION_DESCRIPTIONS[value] || "");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {tooltipText && (
              <div className="bg-muted p-2 rounded-md text-xs text-muted-foreground mb-4 flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                <span>{tooltipText}</span>
              </div>
            )}
            
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
                onValueChange={handleIndicatorChange}
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
                  onValueChange={handleConditionChange}
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
                  value={formData.value?.toString() || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    value: parseFloat(e.target.value) || 0 
                  })}
                  min={VALUE_RANGES[formData.indicator]?.min}
                  max={VALUE_RANGES[formData.indicator]?.max}
                  step="0.1"
                />
                {formData.indicator && (
                  <div className="text-xs text-muted-foreground">
                    Range: {VALUE_RANGES[formData.indicator]?.min} - {VALUE_RANGES[formData.indicator]?.max}
                  </div>
                )}
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
