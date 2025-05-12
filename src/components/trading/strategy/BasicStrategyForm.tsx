
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AITradingStrategy } from "@/types/trading";

interface BasicStrategyFormProps {
  strategy: AITradingStrategy;
  onStrategyChange: (field: string, value: any) => void;
}

const strategyTypes = [
  { value: 'trend-following', label: 'Trend Following', description: 'Follows established market trends' },
  { value: 'mean-reversion', label: 'Mean Reversion', description: 'Trades towards historical mean' },
  { value: 'breakout', label: 'Breakout', description: 'Identifies and trades breakouts from consolidation' },
  { value: 'sentiment', label: 'Sentiment-based', description: 'Uses market sentiment analysis' },
  { value: 'machine-learning', label: 'Machine Learning', description: 'Leverages ML algorithms' },
  { value: 'custom', label: 'Custom', description: 'Build a completely custom strategy' },
];

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

const BasicStrategyForm: React.FC<BasicStrategyFormProps> = ({ strategy, onStrategyChange }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Strategy Name</Label>
        <Input
          id="name"
          value={strategy.name}
          onChange={(e) => onStrategyChange('name', e.target.value)}
          placeholder="Enter strategy name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={strategy.description}
          onChange={(e) => onStrategyChange('description', e.target.value)}
          placeholder="Describe your strategy"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Strategy Type</Label>
          <Select
            value={strategy.type}
            onValueChange={(value) => onStrategyChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select strategy type" />
            </SelectTrigger>
            <SelectContent>
              {strategyTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select
            value={strategy.timeframe}
            onValueChange={(value) => onStrategyChange('timeframe', value)}
          >
            <SelectTrigger id="timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map(tf => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicStrategyForm;
