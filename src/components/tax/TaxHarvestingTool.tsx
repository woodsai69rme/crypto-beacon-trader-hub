
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxHarvestTradeItem } from '@/types/trading';
import { TrendingDown, DollarSign } from 'lucide-react';

const TaxHarvestingTool: React.FC = () => {
  const [positions] = useState<TaxHarvestTradeItem[]>([
    {
      id: '1',
      symbol: 'BTC',
      quantity: 0.5,
      purchasePrice: 70000,
      currentPrice: 65000,
      unrealizedLoss: -2500,
      unrealizedGainLoss: -2500,
      purchaseDate: '2024-01-15',
      recommendedAction: 'sell'
    },
    {
      id: '2',
      symbol: 'ETH',
      quantity: 2.0,
      purchasePrice: 4500,
      currentPrice: 4200,
      unrealizedLoss: -600,
      unrealizedGainLoss: -600,
      purchaseDate: '2024-02-10',
      recommendedAction: 'sell'
    }
  ]);

  const totalLosses = positions.reduce((sum, pos) => 
    sum + (pos.unrealizedGainLoss < 0 ? Math.abs(pos.unrealizedGainLoss) : 0), 0
  );
  
  const eligiblePositions = positions.filter(pos => pos.unrealizedGainLoss < 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Tax Loss Harvesting
        </CardTitle>
        <CardDescription>
          Identify opportunities to offset capital gains with losses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600">Total Unrealized Losses</div>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(totalLosses)}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Eligible Positions</div>
            <div className="text-2xl font-bold text-blue-700">
              {eligiblePositions.length}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Potential Tax Savings</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(totalLosses * 0.325)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loss Harvesting Opportunities</h3>
          {positions.map((position) => (
            <div key={position.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-lg">{position.symbol}</div>
                  <Badge variant={
                    position.unrealizedGainLoss < 0 ? 'destructive' : 'default'
                  }>
                    {position.unrealizedGainLoss < 0 ? 'Loss' : 'Gain'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(Math.abs(position.unrealizedGainLoss))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {position.unrealizedGainLoss < 0 ? 'Unrealized Loss' : 'Unrealized Gain'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{position.quantity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purchase Price:</span>
                  <p className="font-medium">{formatCurrency(position.purchasePrice)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Price:</span>
                  <p className="font-medium">{formatCurrency(position.currentPrice)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <p className="font-medium">{new Date(position.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {position.unrealizedGainLoss < 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded">
                  <div className="text-sm text-orange-800">
                    <strong>Recommendation:</strong> Consider selling to realize loss for tax purposes.
                    Potential tax benefit: {formatCurrency(Math.abs(position.unrealizedGainLoss) * 0.325)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>* Tax loss harvesting can help offset capital gains.</p>
          <p>* Be aware of wash sale rules when repurchasing assets.</p>
          <p>* Consult a tax professional for personalized advice.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxHarvestingTool;
