
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AITradingStrategy } from '@/types/trading';

interface CustomStrategyProps {
  onAddStrategy?: (strategy: AITradingStrategy) => Promise<void>;
}

const CustomStrategy: React.FC<CustomStrategyProps> = ({ onAddStrategy }) => {
  const [name, setName] = useState('');
  const [strategy, setStrategy] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const strategyTypes = [
    { value: 'traditional', label: 'Traditional Technical Analysis' },
    { value: 'ai-predictive', label: 'AI Predictive Analytics' },
    { value: 'hybrid', label: 'Hybrid (AI + Technical)' },
    { value: 'trend-following', label: 'Trend Following' },
    { value: 'mean-reversion', label: 'Mean Reversion' },
    { value: 'breakout', label: 'Breakout Trading' },
    { value: 'sentiment', label: 'Sentiment Analysis' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'multi-timeframe', label: 'Multi-Timeframe Analysis' }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !strategy || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const newStrategy: AITradingStrategy = {
        id: `strategy-${Date.now()}`,
        name,
        description,
        type: strategy as any,
        riskLevel: 'medium',
        profitPotential: 'medium',
        timeframe: "1h",
        parameters: {},
        indicators: ["rsi", "macd", "ema"],
        triggers: ["technical_signal", "volume_spike"],
        performance: {
          accuracy: 0,
          returns: 0,
          sharpeRatio: 0,
          maxDrawdown: 0
        }
      };
      
      if (onAddStrategy) {
        await onAddStrategy(newStrategy);
      }
      
      // Reset form
      setName('');
      setStrategy('');
      setDescription('');
      
      toast({
        title: "Strategy Created",
        description: "Your custom strategy has been added",
      });
    } catch (error) {
      console.error("Error creating strategy:", error);
      toast({
        title: "Error",
        description: "Failed to create custom strategy",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Strategy</CardTitle>
        <CardDescription>
          Define your own AI-powered trading strategy
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Strategy Name</label>
            <Input
              placeholder="My Custom Strategy"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Strategy Type</label>
            <Select value={strategy} onValueChange={setStrategy} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy type" />
              </SelectTrigger>
              <SelectContent>
                {strategyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              placeholder="Describe your strategy's objectives and approach..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Strategy"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomStrategy;
