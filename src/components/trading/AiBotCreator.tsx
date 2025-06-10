
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Brain, Target, Shield, TrendingUp, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';

const AiBotCreator: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    strategy: '',
    model: 'deepseek/deepseek-r1',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    maxTradeAmount: 1000,
    targetAssets: ['BTC', 'ETH'],
    timeframe: '1h',
    stopLoss: 5,
    takeProfit: 10,
    customPrompt: '',
    indicators: [] as string[],
    parameters: {} as Record<string, any>
  });

  const strategies = [
    { id: 'trend-following', name: 'Trend Following', description: 'Follow market trends using moving averages', risk: 'medium', icon: TrendingUp },
    { id: 'mean-reversion', name: 'Mean Reversion', description: 'Buy low, sell high based on price deviations', risk: 'low', icon: Target },
    { id: 'scalping', name: 'Scalping', description: 'Quick trades for small profits', risk: 'high', icon: Zap },
    { id: 'breakout', name: 'Breakout', description: 'Trade on price breakouts from consolidation', risk: 'high', icon: TrendingUp },
    { id: 'arbitrage', name: 'Arbitrage', description: 'Profit from price differences across exchanges', risk: 'low', icon: Shield },
    { id: 'grid', name: 'Grid Trading', description: 'Place buy/sell orders at regular intervals', risk: 'medium', icon: Settings },
    { id: 'momentum', name: 'Momentum', description: 'Follow strong price movements', risk: 'high', icon: TrendingUp },
    { id: 'pattern-recognition', name: 'Pattern Recognition', description: 'Identify chart patterns for trading signals', risk: 'medium', icon: Brain },
    { id: 'sentiment', name: 'Sentiment Analysis', description: 'Trade based on market sentiment and news', risk: 'medium', icon: Brain },
    { id: 'machine-learning', name: 'Machine Learning', description: 'AI-powered predictive trading', risk: 'high', icon: Brain },
    { id: 'whale-tracking', name: 'Whale Tracking', description: 'Follow large wallet movements', risk: 'medium', icon: Target },
    { id: 'custom', name: 'Custom Strategy', description: 'Define your own trading logic', risk: 'variable', icon: Settings }
  ];

  const aiModels = [
    { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', type: 'free', description: 'Powerful reasoning model' },
    { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', type: 'free', description: 'Fast and efficient' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', type: 'paid', description: 'Advanced reasoning' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', type: 'paid', description: 'Multimodal AI model' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', type: 'free', description: 'Open source model' },
    { id: 'nous-research/hermes-3-llama-3.1-405b', name: 'Hermes 3 405B', type: 'free', description: 'Large parameter model' }
  ];

  const technicalIndicators = [
    'Moving Average', 'RSI', 'MACD', 'Bollinger Bands', 'Stochastic', 'Volume', 'Support/Resistance', 'Fibonacci', 'ATR', 'Williams %R'
  ];

  const popularAssets = [
    'BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'AVAX', 'MATIC', 'UNI', 'AAVE', 'SUSHI', 'CRV', 'COMP'
  ];

  const handleCreateBot = async () => {
    if (!formData.name || !formData.strategy) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in bot name and select a strategy',
        variant: 'destructive'
      });
      return;
    }

    try {
      const botConfig = {
        id: `bot-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        strategy: formData.strategy,
        model: formData.model,
        riskLevel: formData.riskLevel,
        maxTradeAmount: formData.maxTradeAmount,
        targetAssets: formData.targetAssets,
        parameters: {
          timeframe: formData.timeframe,
          stopLoss: formData.stopLoss,
          takeProfit: formData.takeProfit,
          indicators: formData.indicators,
          customPrompt: formData.customPrompt,
          ...formData.parameters
        }
      };

      await comprehensiveAiBotSystem.createBot(botConfig);
      
      toast({
        title: 'Bot Created Successfully',
        description: `${formData.name} is ready to start trading!`
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        strategy: '',
        model: 'deepseek/deepseek-r1',
        riskLevel: 'medium',
        maxTradeAmount: 1000,
        targetAssets: ['BTC', 'ETH'],
        timeframe: '1h',
        stopLoss: 5,
        takeProfit: 10,
        customPrompt: '',
        indicators: [],
        parameters: {}
      });
    } catch (error) {
      toast({
        title: 'Error Creating Bot',
        description: 'Failed to create the trading bot. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleIndicator = (indicator: string) => {
    setFormData(prev => ({
      ...prev,
      indicators: prev.indicators.includes(indicator)
        ? prev.indicators.filter(i => i !== indicator)
        : [...prev.indicators, indicator]
    }));
  };

  const toggleAsset = (asset: string) => {
    setFormData(prev => ({
      ...prev,
      targetAssets: prev.targetAssets.includes(asset)
        ? prev.targetAssets.filter(a => a !== asset)
        : [...prev.targetAssets, asset]
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          Create AI Trading Bot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Setup</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="risk">Risk & Assets</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Bitcoin Trend Follower"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this bot does..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="model">AI Model</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <Badge variant={model.type === 'free' ? 'secondary' : 'default'}>
                            {model.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <div>
              <Label>Trading Strategy</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {strategies.map(strategy => {
                  const IconComponent = strategy.icon;
                  return (
                    <Card 
                      key={strategy.id}
                      className={`cursor-pointer transition-all ${
                        formData.strategy === strategy.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, strategy: strategy.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium">{strategy.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                          <Badge variant={
                            strategy.risk === 'low' ? 'secondary' :
                            strategy.risk === 'medium' ? 'default' : 'destructive'
                          }>
                            {strategy.risk} risk
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Technical Indicators</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                {technicalIndicators.map(indicator => (
                  <Badge
                    key={indicator}
                    variant={formData.indicators.includes(indicator) ? 'default' : 'outline'}
                    className="cursor-pointer p-2 justify-center"
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div>
              <Label>Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, riskLevel: value }))}>
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
              <Label>Max Trade Amount (AUD): ${formData.maxTradeAmount}</Label>
              <Slider
                value={[formData.maxTradeAmount]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, maxTradeAmount: value[0] }))}
                max={10000}
                min={100}
                step={100}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Stop Loss (%): {formData.stopLoss}%</Label>
              <Slider
                value={[formData.stopLoss]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, stopLoss: value[0] }))}
                max={20}
                min={1}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Take Profit (%): {formData.takeProfit}%</Label>
              <Slider
                value={[formData.takeProfit]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, takeProfit: value[0] }))}
                max={50}
                min={5}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Target Assets</Label>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-2">
                {popularAssets.map(asset => (
                  <Badge
                    key={asset}
                    variant={formData.targetAssets.includes(asset) ? 'default' : 'outline'}
                    className="cursor-pointer p-2 justify-center"
                    onClick={() => toggleAsset(asset)}
                  >
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div>
              <Label htmlFor="timeframe">Trading Timeframe</Label>
              <Select value={formData.timeframe} onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customPrompt">Custom Strategy Prompt (Optional)</Label>
              <Textarea
                id="customPrompt"
                value={formData.customPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                placeholder="Add custom instructions for the AI bot..."
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-8">
          <Button onClick={handleCreateBot} className="flex-1">
            <Bot className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('basic')}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiBotCreator;
