
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxHarvestTradeItem } from '@/types/trading';
import { TrendingDown, Calculator, AlertTriangle } from 'lucide-react';

const TaxHarvestingTool: React.FC = () => {
  const [harvestItems] = useState<TaxHarvestTradeItem[]>([
    {
      id: '1',
      symbol: 'BTC',
      quantity: 0.5,
      purchasePrice: 65000,
      currentPrice: 58000,
      unrealizedGainLoss: -3500,
      taxLotId: 'lot-1',
      purchaseDate: '2024-01-15'
    },
    {
      id: '2',
      symbol: 'ETH',
      quantity: 10,
      purchasePrice: 3200,
      currentPrice: 2800,
      unrealizedGainLoss: -4000,
      taxLotId: 'lot-2',
      purchaseDate: '2024-02-20'
    }
  ]);

  const totalUnrealizedLoss = harvestItems
    .filter(item => item.unrealizedGainLoss < 0)
    .reduce((sum, item) => sum + Math.abs(item.unrealizedGainLoss), 0);

  const totalTaxSavings = totalUnrealizedLoss * 0.325; // 32.5% tax rate

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Tax Loss Harvesting Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-800">Total Unrealized Losses</h3>
              <p className="text-2xl font-bold text-red-600">
                ${totalUnrealizedLoss.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Potential Tax Savings</h3>
              <p className="text-2xl font-bold text-green-600">
                ${totalTaxSavings.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Harvestable Positions</h3>
              <p className="text-2xl font-bold text-blue-600">
                {harvestItems.filter(item => item.unrealizedGainLoss < 0).length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {harvestItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-lg">{item.symbol}</div>
                    <Badge variant={item.unrealizedGainLoss < 0 ? 'destructive' : 'default'}>
                      {item.unrealizedGainLoss < 0 ? 'Loss' : 'Gain'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Purchase Date</div>
                    <div className="font-medium">{new Date(item.purchaseDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Quantity</div>
                    <div className="font-medium">{item.quantity}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Purchase Price</div>
                    <div className="font-medium">${item.purchasePrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Price</div>
                    <div className="font-medium">${item.currentPrice?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Unrealized P&L</div>
                    <div className={`font-medium ${item.unrealizedGainLoss < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${item.unrealizedGainLoss.toLocaleString()}
                    </div>
                  </div>
                </div>

                {item.unrealizedGainLoss < 0 && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Harvesting this loss could save approximately ${Math.abs(item.unrealizedGainLoss * 0.325).toLocaleString()} in taxes
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Harvest Loss
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Tax Harvesting Summary</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>By harvesting all available losses, you could potentially offset ${totalUnrealizedLoss.toLocaleString()} in capital gains.</p>
              <p className="mt-1">Estimated tax savings: ${totalTaxSavings.toLocaleString()} (based on 32.5% marginal rate)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxHarvestingTool;
