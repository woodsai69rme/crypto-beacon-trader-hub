
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AITradingStrategy } from '@/types/trading';
import { sampleStrategies } from '@/utils/aiTradingStrategies';

interface StrategyCardListProps {
  onSelectStrategy?: (strategy: AITradingStrategy) => void;
}

const StrategyCardList: React.FC<StrategyCardListProps> = ({ onSelectStrategy }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  
  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    setSelectedStrategy(strategy);
    if (onSelectStrategy) {
      onSelectStrategy(strategy);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">AI Trading Strategies</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleStrategies.map((strategy) => (
          <Card key={strategy.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{strategy.name}</span>
                <Badge 
                  variant={
                    strategy.riskLevel === 'low' ? 'outline' : 
                    strategy.riskLevel === 'medium' ? 'secondary' : 'destructive'
                  }
                >
                  {strategy.riskLevel}
                </Badge>
              </CardTitle>
              <CardDescription>{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Win Rate:</span>
                  <span className="font-medium">
                    {strategy.performance?.winRate ? 
                      `${(strategy.performance.winRate * 100).toFixed(1)}%` : 
                      'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profit Factor:</span>
                  <span className="font-medium">
                    {strategy.performance?.profitFactor?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Drawdown:</span>
                  <span className="font-medium text-red-500">
                    {strategy.performance?.maxDrawdown ? 
                      `-${strategy.performance.maxDrawdown.toFixed(1)}%` : 
                      'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-4">
                {strategy.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex space-x-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{strategy.name}</DialogTitle>
                      <DialogDescription>{strategy.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Performance</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Win Rate:</span>
                              <span>{(strategy.performance?.winRate || 0) * 100}%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Profit Factor:</span>
                              <span>{strategy.performance?.profitFactor?.toFixed(2) || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Max Drawdown:</span>
                              <span className="text-red-500">-{strategy.performance?.maxDrawdown || 0}%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Sharpe Ratio:</span>
                              <span>{strategy.performance?.sharpeRatio?.toFixed(2) || 'N/A'}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Strategy Details</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Risk Level:</span>
                              <span>{strategy.riskLevel}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Indicators:</span>
                              <span>{strategy.indicators.length}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Parameters:</span>
                              <span>{strategy.parameters.length}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Timeframes</h4>
                        <div className="flex flex-wrap gap-1">
                          {strategy.timeframes.map((timeframe, index) => (
                            <Badge key={index} variant="outline" className="font-normal">
                              {typeof timeframe === 'string' ? timeframe : timeframe.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Indicators</h4>
                        <div className="flex flex-wrap gap-1">
                          {strategy.indicators.map((indicator, index) => (
                            <Badge key={index} variant="outline" className="font-normal">
                              {indicator.name} ({indicator.period})
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Parameters</h4>
                        <ul className="text-sm space-y-1 mt-2">
                          {strategy.parameters.map((param) => (
                            <li key={param.id} className="flex justify-between">
                              <span className="text-muted-foreground">{param.label || param.name}:</span>
                              <span>{param.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  className="flex-1"
                  style={{ backgroundColor: strategy.color || undefined }}
                  onClick={() => handleSelectStrategy(strategy)}
                >
                  Use Strategy
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyCardList;
