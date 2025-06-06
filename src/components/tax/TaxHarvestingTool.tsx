import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxHarvestTradeItem } from '@/types/trading';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

const TaxHarvestingTool: React.FC = () => {
  const [positions] = useState<TaxHarvestTradeItem[]>([
    {
      id: '1',
      symbol: 'BTC',
      quantity: 0.5,
      purchasePrice: 70000,
      currentPrice: 65000,
      unrealizedGainLoss: -2500,
      taxLotId: 'TL001',
      purchaseDate: '2024-01-15'
    },
    {
      id: '2',
      symbol: 'ETH',
      quantity: 5,
      purchasePrice: 3000,
      currentPrice: 3200,
      unrealizedGainLoss: 1000,
      taxLotId: 'TL002',
      purchaseDate: '2024-02-20'
    }
  ]);

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const totalLosses = positions.filter(p => p.unrealizedGainLoss < 0).reduce((sum, p) => sum + Math.abs(p.unrealizedGainLoss), 0);
  const totalGains = positions.filter(p => p.unrealizedGainLoss > 0).reduce((sum, p) => sum + p.unrealizedGainLoss, 0);
  const netPosition = totalGains - totalLosses;

  const togglePosition = (id: string) => {
    setSelectedPositions(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const harvestLosses = () => {
    const selectedItems = positions.filter(p => selectedPositions.includes(p.id));
    console.log('Harvesting losses for positions:', selectedItems);
    // Implementation for tax loss harvesting
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
              <div className="text-2xl font-bold text-red-500">
                -${totalLosses.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Unrealized Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                +${totalGains.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Unrealized Gains</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${netPosition >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netPosition >= 0 ? '+' : ''}${netPosition.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Position</div>
            </div>
          </div>

          <div className="space-y-2">
            {positions.map((position) => (
              <div 
                key={position.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPositions.includes(position.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => togglePosition(position.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{position.symbol}</div>
                    <Badge variant="outline">{position.quantity} tokens</Badge>
                    <div className="text-sm text-muted-foreground">
                      Purchased: {new Date(position.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        ${position.purchasePrice.toLocaleString()} → ${position.currentPrice.toLocaleString()}
                      </div>
                      <div className={`flex items-center gap-1 ${
                        position.unrealizedGainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {position.unrealizedGainLoss >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {position.unrealizedGainLoss >= 0 ? '+' : ''}${position.unrealizedGainLoss.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPositions.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {selectedPositions.length} position(s) selected for harvesting
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Potential tax savings: Varies by income bracket
                  </div>
                </div>
                <Button onClick={harvestLosses}>
                  Harvest Selected Losses
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxHarvestingTool;
