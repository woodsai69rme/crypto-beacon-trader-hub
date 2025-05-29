
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { openRouterService } from '@/services/openRouterService';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles } from 'lucide-react';

const AiBotCreator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    strategy: '',
    model: '',
    riskLevel: 'low' as 'low' | 'medium' | 'high',
    maxTradeAmount: '1000',
    targetAssets: 'BTC',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { createBot } = useAiTrading();
  const { toast } = useToast();

  const strategies = [
    { id: 'trend-following', name: 'Trend Following', description: 'Follow market trends and momentum' },
    { id: 'mean-reversion', name: 'Mean Reversion', description: 'Trade when prices deviate from average' },
    { id: 'breakout', name: 'Breakout Trading', description: 'Trade on price breakouts from ranges' },
    { id: 'scalping', name: 'Scalping', description: 'Quick trades for small profits' },
    { id: 'momentum', name: 'Momentum', description: 'Trade based on price momentum indicators' },
    { id: 'pattern-recognition', name: 'Pattern Recognition', description: 'Identify and trade chart patterns' },
    { id: 'sentiment', name: 'Sentiment Analysis', description: 'Trade based on market sentiment' }
  ];

  const models = openRouterService.getDefaultModels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.strategy || !formData.model) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const botId = createBot({
        name: formData.name,
        strategy: formData.strategy,
        model: formData.model,
        riskLevel: formData.riskLevel,
        maxTradeAmount: parseFloat(formData.maxTradeAmount),
        targetAssets: formData.targetAssets.split(',').map(s => s.trim())
      });

      toast({
        title: "AI Bot Created Successfully",
        description: `${formData.name} is ready to start trading`,
      });

      // Reset form
      setFormData({
        name: '',
        strategy: '',
        model: '',
        riskLevel: 'low',
        maxTradeAmount: '1000',
        targetAssets: 'BTC',
        description: ''
      });

    } catch (error) {
      toast({
        title: "Error Creating Bot",
        description: "Failed to create AI trading bot",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Create AI Trading Bot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bot Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Trading Bot"
                  required
                />
              </div>

              <div>
                <Label htmlFor="strategy">Trading Strategy *</Label>
                <Select value={formData.strategy} onValueChange={(value) => setFormData({ ...formData, strategy: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map(strategy => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        <div>
                          <div className="font-medium">{strategy.name}</div>
                          <div className="text-xs text-muted-foreground">{strategy.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">AI Model *</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <span className="text-xs px-1 py-0.5 rounded bg-primary/10 text-primary">
                            {model.pricing}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={formData.riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, riskLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk (Conservative)</SelectItem>
                    <SelectItem value="medium">Medium Risk (Balanced)</SelectItem>
                    <SelectItem value="high">High Risk (Aggressive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxTradeAmount">Max Trade Amount (AUD)</Label>
                <Input
                  id="maxTradeAmount"
                  type="number"
                  value={formData.maxTradeAmount}
                  onChange={(e) => setFormData({ ...formData, maxTradeAmount: e.target.value })}
                  placeholder="1000"
                  min="10"
                  max="10000"
                />
              </div>

              <div>
                <Label htmlFor="targetAssets">Target Assets</Label>
                <Input
                  id="targetAssets"
                  value={formData.targetAssets}
                  onChange={(e) => setFormData({ ...formData, targetAssets: e.target.value })}
                  placeholder="BTC, ETH, ADA"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of cryptocurrencies
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your bot's purpose and strategy..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                name: '',
                strategy: '',
                model: '',
                riskLevel: 'low',
                maxTradeAmount: '1000',
                targetAssets: 'BTC',
                description: ''
              })}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Creating Bot...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create AI Bot
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AiBotCreator;
