
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AITradingStrategy } from "@/types/trading";

interface StrategyParametersProps {
  strategy: AITradingStrategy;
  onParameterChange: (param: string, value: any) => void;
}

const StrategyParameters: React.FC<StrategyParametersProps> = ({ strategy, onParameterChange }) => {
  return (
    <div className="space-y-6">
      {/* Indicator Parameters */}
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-4">Indicator Parameters</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="period">Period</Label>
              <span className="text-sm font-mono">{strategy.parameters.period}</span>
            </div>
            <Slider
              id="period"
              min={4}
              max={50}
              step={1}
              value={[strategy.parameters.period]}
              onValueChange={(values) => onParameterChange('period', values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4</span>
              <span>50</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="threshold">Threshold</Label>
              <span className="text-sm font-mono">{strategy.parameters.threshold}</span>
            </div>
            <Slider
              id="threshold"
              min={50}
              max={90}
              step={1}
              value={[strategy.parameters.threshold]}
              onValueChange={(values) => onParameterChange('threshold', values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50</span>
              <span>90</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="useVolume"
              checked={strategy.parameters.useVolume}
              onCheckedChange={(checked) => onParameterChange('useVolume', checked)}
            />
            <Label htmlFor="useVolume">Include volume data in analysis</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="indicator">Main Indicator</Label>
              <Select
                value={strategy.parameters.indicator}
                onValueChange={(value) => onParameterChange('indicator', value)}
              >
                <SelectTrigger id="indicator">
                  <SelectValue placeholder="Select indicator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                  <SelectItem value="bb">Bollinger Bands</SelectItem>
                  <SelectItem value="ma">Moving Average</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Parameters */}
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-4">Risk Parameters</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="stopLoss">Stop Loss (%)</Label>
              <span className="text-sm font-mono">{strategy.parameters.stopLoss}%</span>
            </div>
            <Slider
              id="stopLoss"
              min={1}
              max={15}
              step={0.5}
              value={[strategy.parameters.stopLoss]}
              onValueChange={(values) => onParameterChange('stopLoss', values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <span className="text-sm font-mono">{strategy.parameters.takeProfit}%</span>
            </div>
            <Slider
              id="takeProfit"
              min={2}
              max={30}
              step={1}
              value={[strategy.parameters.takeProfit]}
              onValueChange={(values) => onParameterChange('takeProfit', values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2%</span>
              <span>30%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="allowWeekendTrading"
              checked={strategy.parameters.allowWeekendTrading}
              onCheckedChange={(checked) => onParameterChange('allowWeekendTrading', checked)}
            />
            <Label htmlFor="allowWeekendTrading">Allow weekend trading</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyParameters;
