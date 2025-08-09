
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxHarvestTradeItem } from '@/types/trading';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

const TaxHarvestingTool: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const mockTrades: TaxHarvestTradeItem[] = [
    {
      id: '1',
      symbol: 'BTC',
      amount: 0.1,
      price: 55000,
      type: 'buy',
      date: '2024-01-15',
      gainLoss: -1500,
      unrealizedGainLoss: -1500,
      purchasePrice: 56500,
      currentPrice: 55000
    },
    {
      id: '2',
      symbol: 'ETH',
      amount: 2,
      price: 2800,
      type: 'buy',
      date: '2024-02-20',
      gainLoss: -800,
      unrealizedGainLoss: -800,
      purchasePrice: 3200,
      currentPrice: 2800
    }
  ];

  const totalLoss = mockTrades.reduce((sum, trade) => 
    trade.gainLoss < 0 ? sum + Math.abs(trade.gainLoss) : sum, 0
  );

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const executeTaxHarvesting = () => {
    console.log('Executing tax harvesting for items:', selectedItems);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(Math.abs(value));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tax Loss Harvesting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalLoss)}
              </div>
              <p className="text-sm text-muted-foreground">Total Unrealized Losses</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {selectedItems.length}
              </div>
              <p className="text-sm text-muted-foreground">Selected Positions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  mockTrades
                    .filter(trade => selectedItems.includes(trade.id))
                    .reduce((sum, trade) => sum + Math.abs(trade.gainLoss), 0)
                )}
              </div>
              <p className="text-sm text-muted-foreground">Potential Tax Savings</p>
            </div>
          </div>

          <div className="space-y-3">
            {mockTrades.map((trade) => (
              <Card 
                key={trade.id} 
                className={`cursor-pointer transition-all ${
                  selectedItems.includes(trade.id) 
                    ? 'ring-2 ring-primary bg-muted/30' 
                    : 'hover:bg-muted/20'
                }`}
                onClick={() => toggleSelection(trade.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(trade.id)}
                        onChange={() => toggleSelection(trade.id)}
                        className="rounded"
                      />
                      <div>
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.amount} coins @ {formatCurrency(trade.purchasePrice!)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        <span className="font-medium text-red-600">
                          -{formatCurrency(Math.abs(trade.gainLoss))}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current: {formatCurrency(trade.currentPrice!)}
                      </div>
                    </div>
                    
                    <Badge variant="destructive" className="text-xs">
                      Unrealized Loss
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Select positions to harvest losses for tax benefits
            </div>
            <Button 
              onClick={executeTaxHarvesting}
              disabled={selectedItems.length === 0}
            >
              Execute Tax Harvesting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxHarvestingTool;
