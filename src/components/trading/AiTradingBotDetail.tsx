
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Bot, BarChart, Settings, Play, Pause, Save } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import BasicStrategyForm from "./strategy/BasicStrategyForm";
import StrategyParameters from "./strategy/StrategyParameters";
import StrategyBacktest from "./strategy/StrategyBacktest";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

interface AiTradingBotDetailProps {
  botId?: string;
  onBack: () => void;
}

const AiTradingBotDetail: React.FC<AiTradingBotDetailProps> = ({
  botId,
  onBack
}) => {
  // Find bot data if ID provided, otherwise use empty template
  const initialBot = botId ? 
    predefinedStrategies.find(b => b.id === botId) : 
    {
      id: '',
      name: 'New Trading Bot',
      description: '',
      type: 'trend-following',
      timeframe: '1h',
      parameters: {
        period: 14,
        threshold: 70,
        stopLoss: 5,
        takeProfit: 10,
        riskFactor: 1
      },
      assets: ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'dogecoin']
    };
  
  const [bot, setBot] = useState<AITradingStrategy>(initialBot as AITradingStrategy);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);
  const [backtestResults, setBacktestResults] = useState<any>(null);
  
  const handleBasicChange = (field: string, value: any) => {
    setBot(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleParameterChange = (param: string, value: any) => {
    setBot(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }));
  };
  
  const handleRunBacktest = () => {
    setIsBacktesting(true);
    
    // Simulate backtest delay
    setTimeout(() => {
      const mockResults = {
        returns: Math.random() * 40 - 5, // -5% to +35%
        winRate: 35 + Math.random() * 40, // 35% to 75%
        trades: 20 + Math.floor(Math.random() * 180), // 20 to 200 trades
        maxDrawdown: 5 + Math.random() * 20, // 5% to 25%
        sharpeRatio: 0.1 + Math.random() * 2.4, // 0.1 to 2.5
        profitFactor: 0.8 + Math.random() * 2.2, // 0.8 to 3.0
      };
      
      setBacktestResults(mockResults);
      setIsBacktesting(false);
    }, 2000);
  };
  
  const handleResetBacktest = () => {
    setBacktestResults(null);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl flex items-center gap-2">
            <Bot className="h-6 w-6" />
            {bot.name}
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isActive ? "outline" : "default"}
            size="sm"
            onClick={() => setIsActive(!isActive)}
            className="gap-1"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Bot
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Bot
              </>
            )}
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">
              <Settings className="h-4 w-4 mr-1" />
              Basic Settings
            </TabsTrigger>
            <TabsTrigger value="parameters">
              <Bot className="h-4 w-4 mr-1" />
              Strategy Parameters
            </TabsTrigger>
            <TabsTrigger value="backtest">
              <BarChart className="h-4 w-4 mr-1" />
              Backtesting
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicStrategyForm
              strategy={bot}
              onStrategyChange={handleBasicChange}
            />
          </TabsContent>
          
          <TabsContent value="parameters">
            <StrategyParameters
              strategy={bot}
              onParameterChange={handleParameterChange}
            />
          </TabsContent>
          
          <TabsContent value="backtest">
            <StrategyBacktest
              isBacktesting={isBacktesting}
              backtestResults={backtestResults}
              onBacktest={handleRunBacktest}
              onResetBacktest={handleResetBacktest}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
