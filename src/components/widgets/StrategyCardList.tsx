
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TradingStrategy } from "@/utils/aiTradingStrategies";

interface StrategyCardListProps {
  strategies: TradingStrategy[];
  onSelectStrategy: (strategyId: string) => void;
}

const StrategyCardList = ({ strategies, onSelectStrategy }: StrategyCardListProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="font-medium text-lg">{strategy.name}</div>
              <p className="text-muted-foreground text-sm mt-1">{strategy.description}</p>
              
              <div className="flex flex-wrap gap-2 my-3">
                <Badge variant="outline" className="capitalize">{strategy.type}</Badge>
                <Badge variant="outline" className="capitalize">{strategy.riskLevel} risk</Badge>
                <Badge variant="outline">{strategy.timeframe}</Badge>
              </div>
              
              <div className="text-xs text-muted-foreground mb-2">Key indicators:</div>
              <div className="flex flex-wrap gap-1 mb-4">
                {strategy.indicators.map((indicator, idx) => (
                  <span 
                    key={idx}
                    className="inline-block text-xs bg-muted px-2 py-1 rounded"
                  >
                    {indicator}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                <Button 
                  className="w-full" 
                  onClick={() => onSelectStrategy(strategy.id)}
                >
                  Select Strategy
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyCardList;
