
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, TrendingUp, Activity, Zap } from 'lucide-react';
import AiBotTrading from './AiBotTrading';
import AiTradingBots from './AiTradingBots';
import AiTradingStrategySelector from './AiTradingStrategySelector';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { AITradingStrategy } from '@/types/trading';

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const { bots } = useAiTrading();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);

  const activeBots = bots.filter(bot => bot.status === 'active');
  const totalReturn = bots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0);
  const avgWinRate = bots.length > 0 
    ? bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Trading Dashboard
          </h2>
          <p className="text-muted-foreground">Advanced AI-powered trading with multiple strategies and models</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots.length}</p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(0)}%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                <p className="text-2xl font-bold">{bots.length}</p>
              </div>
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bots">My Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AiBotTrading />
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <AiBotTrading />
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategies</CardTitle>
              <CardDescription>
                Choose from our library of AI-powered trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AiTradingStrategySelector 
                onSelectStrategy={setSelectedStrategy}
                selectedStrategyId={selectedStrategy?.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <AiTradingBots />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
