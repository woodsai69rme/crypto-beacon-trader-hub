
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { useToast } from '@/hooks/use-toast';

const AiBotCreator: React.FC = () => {
  const { createBot } = useAiTrading();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    strategy: '',
    model: 'deepseek/deepseek-r1',
    description: '',
    riskLevel: 'medium'
  });

  const strategies = [
    { value: 'trend-following', label: 'Trend Following' },
    { value: 'mean-reversion', label: 'Mean Reversion' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'breakout', label: 'Breakout' },
    { value: 'arbitrage', label: 'Arbitrage' },
    { value: 'grid', label: 'Grid Trading' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'pattern-recognition', label: 'Pattern Recognition' },
    { value: 'sentiment', label: 'Sentiment-Driven' },
    { value: 'custom', label: 'Custom Strategy' }
  ];

  const models = [
    { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (Free)' },
    { value: 'google/gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Free)' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Paid)' },
    { value: 'openai/gpt-4', label: 'GPT-4 (Paid)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.strategy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createBot({
      name: formData.name,
      strategy: formData.strategy,
      model: formData.model
    });

    // Reset form
    setFormData({
      name: '',
      strategy: '',
      model: 'deepseek/deepseek-r1',
      description: '',
      riskLevel: 'medium'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New AI Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Bot Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter bot name"
              required
            />
          </div>

          <div>
            <Label htmlFor="strategy">Trading Strategy *</Label>
            <Select 
              value={formData.strategy} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map(strategy => (
                  <SelectItem key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="model">AI Model</Label>
            <Select 
              value={formData.model} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select 
              value={formData.riskLevel} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your bot's purpose and settings"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Bot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AiBotCreator;
