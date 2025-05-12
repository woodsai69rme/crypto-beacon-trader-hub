
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, ArrowRight } from "lucide-react";
import { AITradingStrategy } from '@/types/trading';

interface AIStrategySuggestionsProps {
  strategies: AITradingStrategy[];
}

const AIStrategySuggestions: React.FC<AIStrategySuggestionsProps> = ({ strategies }) => {
  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Strategy Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{strategy.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(strategy.riskLevel)} bg-muted`}>
                  {strategy.riskLevel}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-xs">
                  <div className="text-muted-foreground">Win Rate</div>
                  <div className="font-medium">{strategy.performance?.winRate}%</div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">Return Rate</div>
                  <div className="font-medium">
                    {strategy.performance?.returns || strategy.performance?.returnRate || 0}%
                  </div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">Sharpe Ratio</div>
                  <div className="font-medium">{strategy.performance?.sharpeRatio}</div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">Max Drawdown</div>
                  <div className="font-medium">
                    {strategy.performance?.drawdown || strategy.performance?.maxDrawdown || 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <div className="text-xs text-muted-foreground">
                  Assets: {strategy.assets ? strategy.assets.join(', ') : 'N/A'}
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <span className="text-xs">Apply</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-2" asChild>
            <a href="/ai-strategies">
              <TrendingUp className="h-4 w-4 mr-1" />
              View All Strategies
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStrategySuggestions;
