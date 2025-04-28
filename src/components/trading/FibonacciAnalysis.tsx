
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FibonacciLevels } from '@/types/trading';
import { ChevronRight } from 'lucide-react';

const mockFibonacciData: FibonacciLevels[] = [
  {
    coin: "bitcoin",
    timeframe: "1d",
    levels: [
      { extension: 0, price: 93000, significance: 'strong' },
      { extension: 0.236, price: 89500, significance: 'medium' },
      { extension: 0.382, price: 87200, significance: 'medium' },
      { extension: 0.5, price: 85500, significance: 'strong' },
      { extension: 0.618, price: 84100, significance: 'strong' },
      { extension: 0.786, price: 82300, significance: 'medium' },
      { extension: 1, price: 80000, significance: 'strong' },
      { extension: 1.618, price: 75000, significance: 'medium' },
      { extension: 2.618, price: 68000, significance: 'weak' },
    ],
    lastCalculated: "2023-04-26T14:00:00Z"
  },
  {
    coin: "ethereum",
    timeframe: "1d",
    levels: [
      { extension: 0, price: 3800, significance: 'strong' },
      { extension: 0.236, price: 3650, significance: 'medium' },
      { extension: 0.382, price: 3550, significance: 'medium' },
      { extension: 0.5, price: 3480, significance: 'strong' },
      { extension: 0.618, price: 3410, significance: 'strong' },
      { extension: 0.786, price: 3320, significance: 'medium' },
      { extension: 1, price: 3200, significance: 'strong' },
      { extension: 1.618, price: 2950, significance: 'medium' },
      { extension: 2.618, price: 2600, significance: 'weak' },
    ],
    lastCalculated: "2023-04-26T14:00:00Z"
  }
];

const FibonacciAnalysis: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1d");
  
  const selectedData = mockFibonacciData.find(data => data.coin === selectedCoin);
  
  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'strong': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'weak': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fibonacci Analysis</CardTitle>
        <CardDescription>
          Automatic Fibonacci retracement and extension levels for price action analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Cryptocurrency</label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedData ? (
          <div>
            <div className="grid grid-cols-3 font-medium text-sm border-b pb-2">
              <div>Fibonacci Level</div>
              <div>Price</div>
              <div>Significance</div>
            </div>
            
            <div className="space-y-2 mt-2">
              {selectedData.levels.map((level, index) => (
                <div key={index} className="grid grid-cols-3 items-center py-2 border-b border-border/30 last:border-0">
                  <div>{level.extension}</div>
                  <div>${level.price.toLocaleString()}</div>
                  <div>
                    <Badge variant="secondary" className={`${getSignificanceColor(level.significance)}`}>
                      {level.significance.charAt(0).toUpperCase() + level.significance.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Analyzing {selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>Strong support identified at ${selectedData.levels.find(l => l.extension === 0.618)?.price.toLocaleString()} (0.618 Fibonacci level)</span>
                </p>
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>Key resistance at ${selectedData.levels.find(l => l.extension === 0.382)?.price.toLocaleString()} (0.382 Fibonacci level)</span>
                </p>
                <p className="flex items-start">
                  <ChevronRight className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>If price breaks above ${selectedData.levels.find(l => l.extension === 0)?.price.toLocaleString()}, potential target is ${selectedData.levels.find(l => l.extension === 1.618)?.price.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No Fibonacci data available for the selected cryptocurrency and timeframe
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
