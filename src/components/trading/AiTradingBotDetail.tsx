
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, Settings, History, PieChart } from "lucide-react";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

interface AiBotTradingProps {
  botId: string;
  strategyId?: string;
  strategyName: string;
}

interface ExtendedAiBotTradingProps extends AiBotTradingProps {
  botName?: string;
}

const AiTradingBotDetail: React.FC<ExtendedAiBotTradingProps> = ({ 
  botId = 'bot-1',
  strategyId = 'strategy-1',
  strategyName = 'AI Price Prediction',
  botName = 'BTC Momentum Bot'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(true);
  
  const strategy = predefinedStrategies.find(s => s.id === strategyId) || predefinedStrategies[0];
  
  const botStats = {
    trades: 156,
    winRate: 67.3,
    profitLoss: 28.7,
    averageHoldTime: '12h 24m',
    lastTrade: '5 minutes ago',
    dailyPerformance: 1.2,
    weeklyPerformance: 4.5,
    monthlyPerformance: 12.3,
    drawdown: 8.6
  };
  
  const toggleBot = () => {
    setIsRunning(!isRunning);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {botName}
          </CardTitle>
          <Button
            variant={isRunning ? "destructive" : "default"}
            onClick={toggleBot}
            size="sm"
          >
            {isRunning ? 'Stop Bot' : 'Start Bot'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {strategy.type}
          </div>
          <div className="text-sm bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {strategy.timeframe}
          </div>
          <div className="text-sm bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            Risk: {strategy.riskLevel}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-lg font-semibold">{botStats.winRate}%</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Total Profit</div>
            <div className="text-lg font-semibold text-green-500">+{botStats.profitLoss}%</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Trades</div>
            <div className="text-lg font-semibold">{botStats.trades}</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
            <div className="text-lg font-semibold text-red-500">-{botStats.drawdown}%</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="performance">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Strategy Description</h3>
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Performance</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily</span>
                  <span className={botStats.dailyPerformance >= 0 ? "text-green-500" : "text-red-500"}>
                    {botStats.dailyPerformance >= 0 ? "+" : ""}{botStats.dailyPerformance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekly</span>
                  <span className={botStats.weeklyPerformance >= 0 ? "text-green-500" : "text-red-500"}>
                    {botStats.weeklyPerformance >= 0 ? "+" : ""}{botStats.weeklyPerformance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly</span>
                  <span className={botStats.monthlyPerformance >= 0 ? "text-green-500" : "text-red-500"}>
                    {botStats.monthlyPerformance >= 0 ? "+" : ""}{botStats.monthlyPerformance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Trade</span>
                  <span className="text-muted-foreground">{botStats.lastTrade}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Strategy Parameters</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(strategy.parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-mono text-sm">{value.toString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trades">
            <div className="text-sm">Recent trades will appear here</div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-sm">Bot settings will appear here</div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="text-sm">Performance analytics will appear here</div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Backtest
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <PieChart className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
