
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TaxHarvestTradeItem } from '@/types/trading';
import { Calculator, Download, DollarSign } from 'lucide-react';

const TaxHarvestingTool: React.FC = () => {
  const [tradeItems] = useState<TaxHarvestTradeItem[]>([
    {
      id: 'item-1',
      symbol: 'BTC',
      quantity: 0.5,
      costBasis: 45000,
      currentPrice: 50000,
      currentValue: 25000,
      profitLoss: 2500,
      purchaseDate: '2024-01-15',
      taxLotId: 'lot-1'
    },
    {
      id: 'item-2',
      symbol: 'ETH',
      quantity: 10,
      costBasis: 2800,
      currentPrice: 3000,
      currentValue: 30000,
      profitLoss: 2000,
      purchaseDate: '2024-02-10',
      taxLotId: 'lot-2'
    }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const totalPotentialLoss = selectedItems.reduce((sum, itemId) => {
    const item = tradeItems.find(t => t.id === itemId);
    return sum + (item?.profitLoss && item.profitLoss < 0 ? Math.abs(item.profitLoss) : 0);
  }, 0);

  const generateHarvestPlan = () => {
    console.log('Generating tax harvest plan...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tax Loss Harvesting</h2>
          <p className="text-muted-foreground">
            Optimize your tax position by harvesting losses
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateHarvestPlan} className="gap-2">
            <Calculator className="h-4 w-4" />
            Generate Plan
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Tax Savings</p>
                <p className="text-2xl font-bold text-green-600">${totalPotentialLoss.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Items</p>
                <p className="text-2xl font-bold">{selectedItems.length}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Lots</p>
                <p className="text-2xl font-bold">{tradeItems.length}</p>
              </div>
              <Badge className="h-8 w-8 flex items-center justify-center">
                {tradeItems.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Lots Available for Harvesting</CardTitle>
          <CardDescription>
            Select holdings with losses to optimize your tax position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Basis</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.symbol}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.costBasis.toLocaleString()}</TableCell>
                  <TableCell>${item.currentValue?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={item.profitLoss && item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.profitLoss && item.profitLoss >= 0 ? '+' : ''}${item.profitLoss?.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxHarvestingTool;
