
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITradingStrategy } from "@/types/trading";

// Define strategy presets
const strategyPresets: AITradingStrategy[] = [
  {
    id: "trend-1",
    name: "Trend Follower",
    description: "Follows market momentum using moving averages",
    type: "trend-following",
    timeframe: "1d",
    riskLevel: "medium",
    parameters: {
      lookbackPeriod: 14,
      stopLoss: 5,
      takeProfit: 15,
      capitalAllocation: 25
    },
    performance: {
      winRate: 65,
      profitFactor: 1.8,
      totalTrades: 124,
      averageProfit: 2.3,
      maxDrawdown: 12
    }
  },
  {
    id: "mean-1",
    name: "Mean Reversion",
    description: "Trades price reversals to the mean",
    type: "mean-reversion",
    timeframe: "4h",
    riskLevel: "high",
    parameters: {
      lookbackPeriod: 20,
      stopLoss: 3,
      takeProfit: 10,
      capitalAllocation: 15
    },
    performance: {
      winRate: 58,
      profitFactor: 1.5,
      totalTrades: 186,
      averageProfit: 1.7,
      maxDrawdown: 18
    }
  },
  {
    id: "breakout-1",
    name: "Breakout Hunter",
    description: "Catches high momentum breakouts from consolidation",
    type: "breakout",
    timeframe: "1h",
    riskLevel: "high",
    parameters: {
      lookbackPeriod: 24,
      stopLoss: 7,
      takeProfit: 20,
      capitalAllocation: 10
    },
    performance: {
      winRate: 52,
      profitFactor: 2.1,
      totalTrades: 95,
      averageProfit: 3.8,
      maxDrawdown: 22
    }
  }
];

const AiTradingBots: React.FC = () => {
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trading Bots</CardTitle>
        <CardDescription>Explore and manage automated trading strategies</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList>
            <TabsTrigger value="explore">Explore Strategies</TabsTrigger>
            <TabsTrigger value="manage">Manage Bots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="space-y-4">
            <h3 className="text-lg font-semibold">Strategy Presets</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {strategyPresets.map((strategy) => (
                <Card key={strategy.id} className="bg-muted hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle>{strategy.name}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Type: {strategy.type}</p>
                    <p>Timeframe: {strategy.timeframe}</p>
                    <p>Risk: {strategy.riskLevel}</p>
                    {strategy.performance && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="font-medium">Performance</p>
                        <p>Win Rate: {strategy.performance.winRate}%</p>
                        <p>Profit Factor: {strategy.performance.profitFactor}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <button className="w-full bg-primary text-primary-foreground rounded-md p-2 hover:bg-primary/80 transition-colors">
                      Start Bot
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="manage">
            <h3 className="text-lg font-semibold">Active Bots</h3>
            <p>No active bots running.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
