
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface AiTradingStrategySelectorProps {
  botId: string;
  onSelectStrategy: (strategyId: string) => void;
}

interface StrategyParameter {
  id: string;
  name: string;
  type: 'slider' | 'switch' | 'input';
  value: any;
  min?: number;
  max?: number;
  step?: number;
}

const STRATEGIES = [
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Buy when price is below mean, sell when above",
    parameters: [
      { id: "period", name: "Period", type: "slider", value: 14, min: 5, max: 50, step: 1 },
      { id: "threshold", name: "Threshold", type: "slider", value: 2, min: 1, max: 5, step: 0.1 },
      { id: "useVolume", name: "Consider Volume", type: "switch", value: true }
    ]
  },
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Follow market trends using moving averages",
    parameters: [
      { id: "fastPeriod", name: "Fast Period", type: "slider", value: 9, min: 3, max: 20, step: 1 },
      { id: "slowPeriod", name: "Slow Period", type: "slider", value: 21, min: 10, max: 50, step: 1 },
      { id: "signalPeriod", name: "Signal Period", type: "slider", value: 7, min: 3, max: 15, step: 1 },
      { id: "useMACD", name: "Use MACD", type: "switch", value: true }
    ]
  },
  {
    id: "breakout",
    name: "Breakout Trading",
    description: "Enter when price breaks through support/resistance",
    parameters: [
      { id: "period", name: "Period", type: "slider", value: 20, min: 10, max: 100, step: 5 },
      { id: "multFactor", name: "Multiplier", type: "slider", value: 1.5, min: 1, max: 3, step: 0.1 },
      { id: "useVolFilter", name: "Volume Filter", type: "switch", value: true }
    ]
  },
  {
    id: "ml-ensemble",
    name: "ML Ensemble",
    description: "Combine multiple ML models for higher accuracy",
    parameters: [
      { id: "lookback", name: "Lookback Period", type: "slider", value: 30, min: 10, max: 100, step: 5 },
      { id: "confidence", name: "Min. Confidence", type: "slider", value: 0.7, min: 0.5, max: 0.95, step: 0.05 },
      { id: "useSentiment", name: "Include Sentiment", type: "switch", value: true }
    ]
  }
];

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({
  botId,
  onSelectStrategy
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Record<string, StrategyParameter[]>>({});
  
  // Initialize parameters with default values when a strategy is selected
  const handleSelectStrategy = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    
    const strategy = STRATEGIES.find(s => s.id === strategyId);
    if (strategy) {
      setParameters({
        ...parameters,
        [strategyId]: [...strategy.parameters]
      });
    }
    
    onSelectStrategy(strategyId);
  };
  
  const updateParameter = (strategyId: string, paramId: string, value: any) => {
    setParameters(prev => {
      const updatedParams = prev[strategyId].map(param => 
        param.id === paramId ? { ...param, value } : param
      );
      
      return {
        ...prev,
        [strategyId]: updatedParams
      };
    });
  };
  
  const applyStrategy = () => {
    if (!selectedStrategy) return;
    
    toast({
      title: "Strategy Applied",
      description: `The ${STRATEGIES.find(s => s.id === selectedStrategy)?.name} strategy has been applied to the AI bot`
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium mb-3">Available Strategies</div>
            <div className="space-y-2">
              {STRATEGIES.map(strategy => (
                <Button
                  key={strategy.id}
                  variant={selectedStrategy === strategy.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleSelectStrategy(strategy.id)}
                >
                  <div className="text-left">
                    <div>{strategy.name}</div>
                    <div className="text-xs text-muted-foreground">{strategy.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            {selectedStrategy ? (
              <>
                <div className="text-sm font-medium mb-3">
                  Strategy Parameters
                </div>
                <div className="space-y-6">
                  {parameters[selectedStrategy]?.map(param => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={param.id}>{param.name}</Label>
                        {param.type === 'slider' && (
                          <span className="text-sm">{param.value}</span>
                        )}
                      </div>
                      
                      {param.type === 'slider' && (
                        <Slider
                          id={param.id}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={[param.value]}
                          onValueChange={([value]) => updateParameter(selectedStrategy, param.id, value)}
                        />
                      )}
                      
                      {param.type === 'switch' && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={param.id}
                            checked={param.value}
                            onCheckedChange={(checked) => updateParameter(selectedStrategy, param.id, checked)}
                          />
                          <Label htmlFor={param.id}>
                            {param.value ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                      )}
                      
                      {param.type === 'input' && (
                        <Input
                          id={param.id}
                          value={param.value}
                          onChange={(e) => updateParameter(selectedStrategy, param.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button className="w-full mt-4" onClick={applyStrategy}>
                    Apply Strategy
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a strategy to view and configure parameters
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingStrategySelector;
