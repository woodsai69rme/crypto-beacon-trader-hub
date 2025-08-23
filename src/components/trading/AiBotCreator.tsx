import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AITradingStrategyConfig, BotConfig } from '@/types/trading';

interface AiBotCreatorProps {
  onCreateBot: (bot: BotConfig) => void;
  strategies: AITradingStrategyConfig[];
}

const AiBotCreator: React.FC<AiBotCreatorProps> = ({ onCreateBot, strategies }) => {
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategyConfig | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [maxTradeAmount, setMaxTradeAmount] = useState(1000);
  const [targetAssets, setTargetAssets] = useState<string[]>([]);

  const handleCreateBot = () => {
    if (!selectedStrategy) return;
    
    const newBot: BotConfig = {
      id: Date.now().toString(),
      name: botName,
      description: botDescription,
      strategy: selectedStrategy.type, // Use the type string, not the full object
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
      maxPositionSize: maxTradeAmount,
      stopLossPercentage: 5,
      takeProfitPercentage: 15,
      targetSymbols: targetAssets,
      model: selectedModel,
      maxTradeAmount: maxTradeAmount,
      targetAssets: targetAssets,
      parameters: {
        aiModel: selectedModel,
        maxTradeAmount: maxTradeAmount,
        targetAssets: targetAssets,
        riskLevel: riskLevel
      }
    };
    
    onCreateBot(newBot);
    
    // Reset form
    setBotName('');
    setBotDescription('');
    setSelectedStrategy(null);
    setSelectedModel('gpt-4');
    setRiskLevel('medium');
    setMaxTradeAmount(1000);
    setTargetAssets([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New AI Trading Bot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bot-name">Bot Name</Label>
          <Input
            id="bot-name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bot-description">Bot Description</Label>
          <Input
            id="bot-description"
            value={botDescription}
            onChange={(e) => setBotDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="strategy">Trading Strategy</Label>
          <Select onValueChange={(value) => {
              const strategy = strategies.find(s => s.id === value);
              setSelectedStrategy(strategy || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a strategy" />
            </SelectTrigger>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="ai-model">AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="llama-2">Llama 2</SelectItem>
              <SelectItem value="bloom">BLOOM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="risk-level">Risk Level</Label>
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="max-trade-amount">Max Trade Amount</Label>
          <Input
            type="number"
            id="max-trade-amount"
            value={maxTradeAmount.toString()}
            onChange={(e) => setMaxTradeAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="target-assets">Target Assets (Comma Separated)</Label>
          <Input
            id="target-assets"
            value={targetAssets.join(',')}
            onChange={(e) => setTargetAssets(e.target.value.split(',').map(s => s.trim()))}
          />
        </div>
        <Button onClick={handleCreateBot}>Create Bot</Button>
      </CardContent>
    </Card>
  );
};

export default AiBotCreator;
