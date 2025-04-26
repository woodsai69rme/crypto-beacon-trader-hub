
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";
import StrategyCardList from "../widgets/StrategyCardList";
import BacktestingPanel from "../widgets/BacktestingPanel";
import StrategyOptimization from "../widgets/StrategyOptimization";
import CustomStrategy from "../widgets/CustomStrategy";
import LocalModelTrading from "./LocalModelTrading";
import AiTradingMcp from "./AiTradingMcp";
import MultiCoinChart from "../charts/MultiCoinChart";
import RealTimeTrading from "./RealTimeTrading";
import RealTimeStrategyPerformance from "./RealTimeStrategyPerformance";
import AiBotTrading from "./AiBotTrading";

const AiTradingBots = () => {
  const [activeTab, setActiveTab] = useState<string>("strategies");
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  
  const handleSelectStrategy = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    setActiveTab("backtest");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Trading Bots</CardTitle>
          <CardDescription>
            Automated trading strategies powered by artificial intelligence
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-9 mb-6">
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="backtest">Backtest</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="real-time">Real-Time</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="local">Local AI</TabsTrigger>
              <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategies">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <StrategyCardList 
                    strategies={predefinedStrategies} 
                    onSelectStrategy={handleSelectStrategy} 
                  />
                </div>
                <div className="lg:col-span-1">
                  {selectedStrategyId ? (
                    <AiBotTrading 
                      botId={selectedStrategyId} 
                      strategyId={selectedStrategyId} 
                      strategyName={predefinedStrategies.find(s => s.id === selectedStrategyId)?.name || "AI Strategy"} 
                    />
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Trading Bot</CardTitle>
                        <CardDescription>Select a strategy to start a trading bot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                          Select a strategy from the list to get started
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="backtest">
              <BacktestingPanel selectedStrategyId={selectedStrategyId} />
            </TabsContent>
            
            <TabsContent value="optimize">
              <StrategyOptimization selectedStrategyId={selectedStrategyId} />
            </TabsContent>

            <TabsContent value="charts">
              <MultiCoinChart />
            </TabsContent>
            
            <TabsContent value="custom">
              <CustomStrategy />
            </TabsContent>
            
            <TabsContent value="real-time">
              <RealTimeTrading />
            </TabsContent>
            
            <TabsContent value="performance">
              <RealTimeStrategyPerformance />
            </TabsContent>
            
            <TabsContent value="local">
              <LocalModelTrading />
            </TabsContent>
            
            <TabsContent value="mcp">
              <AiTradingMcp />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBots;
