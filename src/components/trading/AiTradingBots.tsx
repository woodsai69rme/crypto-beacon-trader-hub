
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";
import StrategyCardList from "../widgets/StrategyCardList";
import BacktestingPanel from "../widgets/BacktestingPanel";
import StrategyOptimization from "../widgets/StrategyOptimization";
import CustomStrategy from "../widgets/CustomStrategy";
import LocalModelTrading from "./LocalModelTrading";

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
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="backtest">Backtest</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="local">Local AI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategies">
              <StrategyCardList 
                strategies={predefinedStrategies} 
                onSelectStrategy={handleSelectStrategy} 
              />
            </TabsContent>
            
            <TabsContent value="backtest">
              <BacktestingPanel selectedStrategyId={selectedStrategyId} />
            </TabsContent>
            
            <TabsContent value="optimize">
              <StrategyOptimization selectedStrategyId={selectedStrategyId} />
            </TabsContent>
            
            <TabsContent value="custom">
              <CustomStrategy />
            </TabsContent>
            
            <TabsContent value="local">
              <LocalModelTrading />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBots;
