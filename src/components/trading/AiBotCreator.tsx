
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Bot, Save, Play } from "lucide-react";
import { useAiTrading } from '@/contexts/AiTradingContext';
import { useToast } from '@/hooks/use-toast';
import { getAvailableStrategies } from '@/services/trading/strategyService';

const AiBotCreator: React.FC = () => {
  const { createBot, activateBot } = useAiTrading();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const [botConfig, setBotConfig] = useState({
    name: '',
    strategy: 'trend-following',
    model: 'deepseek/deepseek-r1',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    maxTradeAmount: 1000,
    targetAssets: ['BTC'],
    autoStart: false,
    customPrompt: ''
  });

  const strategies = getAvailableStrategies();
  const aiModels = [
    { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (Free)', provider: 'DeepSeek' },
    { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Free)', provider: 'Google' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' }
  ];

  const cryptocurrencies = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!botConfig.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Bot name is required",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const botId = createBot({
        name: botConfig.name,
        strategy: botConfig.strategy,
        model: botConfig.model,
        riskLevel: botConfig.riskLevel,
        maxTradeAmount: botConfig.maxTradeAmount,
        targetAssets: botConfig.targetAssets
      });

      if (botConfig.autoStart) {
        activateBot(botId);
      }

      toast({
        title: "Bot Created Successfully",
        description: `${botConfig.name} has been created${botConfig.autoStart ? ' and started' : ''}`,
      });

      // Reset form
      setBotConfig({
        name: '',
        strategy: 'trend-following',
        model: 'deepseek/deepseek-r1',
        riskLevel: 'medium',
        maxTradeAmount: 1000,
        targetAssets: ['BTC'],
        autoStart: false,
        customPrompt: ''
      });

    } catch (error) {
      toast({
        title: "Error Creating Bot",
        description: "Failed to create trading bot. Please try again.",
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
          <Bot className="h-5 w-5" />
          Create AI Trading Bot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                placeholder="Enter bot name"
                value={botConfig.name}
                onChange={(e) => setBotConfig(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Trading Strategy</Label>
              <Select value={botConfig.strategy} onValueChange={(value) => setBotConfig(prev => ({ ...prev, strategy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.slice(0, 8).map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={botConfig.model} onValueChange={(value) => setBotConfig(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={botConfig.riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setBotConfig(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTrade">Max Trade Amount (AUD)</Label>
              <Input
                id="maxTrade"
                type="number"
                placeholder="1000"
                value={botConfig.maxTradeAmount}
                onChange={(e) => setBotConfig(prev => ({ ...prev, maxTradeAmount: Number(e.target.value) }))}
                min="100"
                max="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAsset">Target Asset</Label>
              <Select value={botConfig.targetAssets[0]} onValueChange={(value) => setBotConfig(prev => ({ ...prev, targetAssets: [value] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map(crypto => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Strategy Prompt (Optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Describe any specific trading rules or preferences for this bot..."
              value={botConfig.customPrompt}
              onChange={(e) => setBotConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoStart"
                checked={botConfig.autoStart}
                onCheckedChange={(checked) => setBotConfig(prev => ({ ...prev, autoStart: checked }))}
              />
              <Label htmlFor="autoStart">Start bot immediately after creation</Label>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Bot
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AiBotCreator;
