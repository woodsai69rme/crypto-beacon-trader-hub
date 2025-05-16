
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AITradingStrategy } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/components/ui/use-toast';
import { v4 as generateId } from 'uuid';

// Define interface for form data
interface StrategyFormData {
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  parameters: Record<string, any>;
}

const CustomStrategy: React.FC = () => {
  const [formData, setFormData] = useState<StrategyFormData>({
    name: "",
    description: "",
    type: "custom",
    timeframe: "1d",
    riskLevel: "medium",
    parameters: {
      lookbackPeriod: 14,
      stopLoss: 5,
      takeProfit: 10,
      capitalAllocation: 10
    }
  });
  
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the strategy object
    const strategy: AITradingStrategy = {
      id: generateId(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      timeframe: formData.timeframe,
      parameters: formData.parameters,
      riskLevel: formData.riskLevel,
      indicators: selectedIndicators
    };
    
    // In a real app, this would save the strategy
    console.log("Created strategy:", strategy);
    
    toast({
      title: "Strategy Created",
      description: `Successfully created "${formData.name}" strategy`,
    });
  };
  
  const availableIndicators = [
    "RSI", "MACD", "Moving Average", "Bollinger Bands", 
    "Stochastic", "ATR", "Volume", "OBV"
  ];
  
  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend-following">Trend Following</SelectItem>
                  <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                  <SelectItem value="breakout">Breakout</SelectItem>
                  <SelectItem value="sentiment">Sentiment Based</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={formData.timeframe}
                onValueChange={(value) => setFormData({...formData, timeframe: value})}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="risk">Risk Level</Label>
            <Select 
              value={formData.riskLevel}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData({...formData, riskLevel: value})
              }
            >
              <SelectTrigger id="risk">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Technical Indicators</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableIndicators.map(indicator => (
                <div key={indicator} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`indicator-${indicator}`} 
                    checked={selectedIndicators.includes(indicator)}
                    onCheckedChange={() => handleIndicatorToggle(indicator)}
                  />
                  <Label 
                    htmlFor={`indicator-${indicator}`}
                    className="text-sm font-normal"
                  >
                    {indicator}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit">Create Strategy</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomStrategy;
