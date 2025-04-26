
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITradingStrategy } from "@/types/trading";
import AiBotTrading from "../trading/AiBotTrading";

interface StrategyCardListProps {
  strategies: AITradingStrategy[];
  onSelectStrategy: (strategyId: string) => void;
}

const StrategyCardList = ({ strategies, onSelectStrategy }: StrategyCardListProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Strategy List</TabsTrigger>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="overflow-hidden">
                <div className="h-2" style={{ backgroundColor: strategy.color }}></div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{strategy.name}</h3>
                      <Badge variant={strategy.type === "ai" ? "default" : "secondary"}>
                        {strategy.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 text-xs">
                      <span className="text-muted-foreground">Win Rate:</span>
                      <span>{strategy.stats.winRate}%</span>
                    </div>
                    <div className="grid grid-cols-2 text-xs">
                      <span className="text-muted-foreground">Avg Return:</span>
                      <span>{strategy.stats.averageReturn}%</span>
                    </div>
                    <div className="grid grid-cols-2 text-xs">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <span>{strategy.stats.riskLevel}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    variant="default"
                    onClick={() => onSelectStrategy(strategy.id)}
                  >
                    Backtest Strategy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="bots">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <AiBotTrading 
                key={strategy.id}
                botId={`bot-${strategy.id}`}
                strategyId={strategy.id}
                strategyName={strategy.name}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyCardList;
