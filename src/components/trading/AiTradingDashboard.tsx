
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  ChevronRight, 
  TrendingUp, 
  Settings, 
  RefreshCw, 
  AlertTriangle
} from "lucide-react";
import AiTradingBotList from './AiTradingBotList';
import AiTradingBotMetrics from './AiTradingBotMetrics';
import AiTradingVisualizer from './AiTradingVisualizer';
import { AITradingStrategy } from '@/types/trading';
import { getStrategyById } from '@/utils/aiTradingStrategies';
import RealTimePriceChart from './RealTimePriceChart';
import MarketCorrelationMatrix from '../MarketCorrelations/MarketCorrelationMatrix';
import { toast } from '@/components/ui/use-toast';
import { fetchTopCryptoData } from '@/services/api/coinGeckoService';

const AiTradingDashboard: React.FC = () => {
  const [activeBotIds, setActiveBotIds] = useState<string[]>(['strategy-1']);
  const [selectedBot, setSelectedBot] = useState<AITradingStrategy | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [timeframe, setTimeframe] = useState<string>('7');

  useEffect(() => {
    // Initialize with the first active bot
    if (activeBotIds.length > 0) {
      const defaultBot = getStrategyById(activeBotIds[0]);
      if (defaultBot) {
        setSelectedBot(defaultBot);
      }
    }

    // Initialize with top crypto data
    fetchTopCryptoData(1).then(coins => {
      if (coins.length > 0) {
        setSelectedCoin(coins[0].id);
      }
    });
  }, []);

  const handleSelectBot = (bot: AITradingStrategy) => {
    setSelectedBot(bot);
  };

  const handleStartBot = (botId: string) => {
    setActiveBotIds(prev => [...prev, botId]);
  };

  const handleStopBot = (botId: string) => {
    setActiveBotIds(prev => prev.filter(id => id !== botId));
  };

  const handleEditBot = (botId: string) => {
    toast({
      title: "Edit Bot",
      description: "Bot configuration panel will be opened",
    });
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI-powered trading strategies and monitor performance
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dashboard Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Bot list */}
        <div className="lg:col-span-1 space-y-6">
          <AiTradingBotList
            onSelectBot={handleSelectBot}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            onEditBot={handleEditBot}
            activeBots={activeBotIds}
          />
        </div>

        {/* Right column - Selected bot details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBot ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <Bot className="mr-2 h-5 w-5" />
                        {selectedBot.name}
                      </CardTitle>
                      <CardDescription>
                        {selectedBot.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      {activeBotIds.includes(selectedBot.id) ? (
                        <Button variant="destructive" size="sm" onClick={() => handleStopBot(selectedBot.id)}>
                          Stop Bot
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={() => handleStartBot(selectedBot.id)}>
                          Start Bot
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    <AiTradingMetricsSummary
                      strategy={selectedBot}
                      isActive={activeBotIds.includes(selectedBot.id)}
                    />
                    
                    <Tabs defaultValue="visualizer" className="mt-6">
                      <TabsList>
                        <TabsTrigger value="visualizer">Trading Visualization</TabsTrigger>
                        <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                        <TabsTrigger value="chart">Price Chart</TabsTrigger>
                      </TabsList>
                      <TabsContent value="visualizer">
                        <AiTradingVisualizer
                          botId={selectedBot.id}
                          tradingPair={`${selectedCoin.toUpperCase()}/USD`}
                          timeframe={selectedBot.timeframe}
                          isRunning={activeBotIds.includes(selectedBot.id)}
                        />
                      </TabsContent>
                      <TabsContent value="metrics">
                        <AiTradingBotMetrics
                          botId={selectedBot.id}
                          isRunning={activeBotIds.includes(selectedBot.id)}
                        />
                      </TabsContent>
                      <TabsContent value="chart">
                        <RealTimePriceChart
                          coinId={selectedCoin}
                          coinName={selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}
                          timeframe={timeframe}
                          onTimeframeChange={handleTimeframeChange}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
              
              <MarketCorrelationMatrix maxCoins={6} />
            </>
          ) : (
            <Card className="h-full flex items-center justify-center p-10">
              <div className="text-center">
                <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No bot selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a bot from the list to view its details and performance metrics
                </p>
                <Button className="flex items-center gap-1">
                  Create New Bot <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface AiTradingMetricsSummaryProps {
  strategy: AITradingStrategy;
  isActive: boolean;
}

const AiTradingMetricsSummary: React.FC<AiTradingMetricsSummaryProps> = ({ strategy, isActive }) => {
  // Generate some mock performance data
  const generatePerformanceData = () => {
    const baseReturn = Math.random() * 15 - 5; // -5% to +10%
    
    return {
      daily: (baseReturn / 30).toFixed(2),
      weekly: (baseReturn / 4).toFixed(2),
      monthly: baseReturn.toFixed(2),
      totalTrades: Math.floor(Math.random() * 50) + 10,
      winRate: (Math.random() * 0.3 + 0.5).toFixed(2) // 50% to 80%
    };
  };
  
  const performanceData = generatePerformanceData();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Daily</p>
          <p className={`text-xl font-bold ${Number(performanceData.daily) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(performanceData.daily) >= 0 ? '+' : ''}{performanceData.daily}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Weekly</p>
          <p className={`text-xl font-bold ${Number(performanceData.weekly) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(performanceData.weekly) >= 0 ? '+' : ''}{performanceData.weekly}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Monthly</p>
          <p className={`text-xl font-bold ${Number(performanceData.monthly) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(performanceData.monthly) >= 0 ? '+' : ''}{performanceData.monthly}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Total Trades</p>
          <p className="text-xl font-bold">{performanceData.totalTrades}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-xl font-bold">{Math.round(Number(performanceData.winRate) * 100)}%</p>
        </CardContent>
      </Card>
      
      {!isActive && (
        <div className="col-span-2 md:col-span-5 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm">This bot is currently inactive. Start the bot to begin automated trading based on this strategy.</p>
        </div>
      )}
    </div>
  );
};

export default AiTradingDashboard;
