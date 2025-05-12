
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, ArrowUpRight } from "lucide-react";
import { AITradingStrategy } from '@/types/trading';
import { mockAIStrategies } from '@/utils/mockData';

interface AIStrategySuggestionsProps {
  strategies?: AITradingStrategy[];
  onViewStrategy?: (strategy: AITradingStrategy) => void;
}

const AIStrategySuggestions: React.FC<AIStrategySuggestionsProps> = ({ 
  strategies = mockAIStrategies,
  onViewStrategy 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          AI Trading Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {strategies.map((strategy) => (
            <div 
              key={strategy.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onViewStrategy && onViewStrategy(strategy)}
            >
              <div className="space-y-0.5">
                <div className="font-medium text-sm">{strategy.name}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{strategy.type} • {strategy.timeframe}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  {strategy.performance?.returns && (
                    <Badge variant="outline" className="font-mono text-green-500 mr-2">
                      +{strategy.performance.returns}%
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {strategy.performance?.winRate ? `${strategy.performance.winRate}% win rate` : ''}
                  {strategy.performance?.drawdown ? ` • ${strategy.performance.drawdown}% draw.` : ''}
                </div>
              </div>
            </div>
          ))}
          
          {strategies.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No strategy suggestions available</p>
            </div>
          )}
          
          {/* Only display assets if they exist */}
          {strategies.length > 0 && strategies[0].assets && strategies[0].assets.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t">
              {strategies[0].assets.map((asset) => (
                <Badge key={asset} variant="secondary" className="text-xs">
                  {asset.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStrategySuggestions;
