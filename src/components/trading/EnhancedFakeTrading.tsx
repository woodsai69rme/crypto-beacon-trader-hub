
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTradingContext } from '@/contexts/TradingContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';
import TradingHoldings from './TradingHoldings';
import { Trade } from '@/types/trading';

const EnhancedFakeTrading: React.FC = () => {
  const [tradeData, setTradeData] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { activeAccount, addTrade } = useTradingContext();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 45000 + Math.random() * 10000 },
    { symbol: 'ETH', name: 'Ethereum', price: 2500 + Math.random() * 1000 },
    { symbol: 'ADA', name: 'Cardano', price: 0.5 + Math.random() * 0.5 },
    { symbol: 'DOT', name: 'Polkadot', price: 8 + Math.random() * 4 },
    { symbol: 'SOL', name: 'Solana', price: 80 + Math.random() * 40 },
    { symbol: 'MATIC', name: 'Polygon', price: 1 + Math.random() * 1 },
    { symbol: 'LINK', name: 'Chainlink', price: 15 + Math.random() * 10 }
  ];

  const selectedAsset = cryptoAssets.find(asset => asset.symbol === tradeData.symbol);
  const totalValue = selectedAsset && tradeData.quantity ? 
    parseFloat(tradeData.quantity) * selectedAsset.price : 0;

  const handleTrade = () => {
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please create a trading account first",
        variant: "destructive"
      });
      return;
    }

    if (!tradeData.symbol || !tradeData.quantity || !selectedAsset) {
      toast({
        title: "Missing Information",
        description: "Please fill in all trade details",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseFloat(tradeData.quantity);
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (tradeData.type === 'buy' && totalValue > activeAccount.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${formatCurrency(totalValue)} but only have ${formatCurrency(activeAccount.balance)}`,
        variant: "destructive"
      });
      return;
    }

    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol: tradeData.symbol,
      coinSymbol: tradeData.symbol,
      coinId: tradeData.symbol.toLowerCase(),
      coinName: selectedAsset.name,
      type: tradeData.type,
      quantity: quantity,
      amount: quantity,
      price: selectedAsset.price,
      totalValue,
      total: totalValue,
      timestamp: new Date(tradeData.date).toISOString(),
      currency: 'AUD',
      tags: ['paper-trading']
    };

    addTrade(trade);

    toast({
      title: "Trade Executed",
      description: `${tradeData.type.toUpperCase()} ${quantity} ${tradeData.symbol} for ${formatCurrency(totalValue)}`,
    });

    // Reset form
    setTradeData({
      symbol: '',
      type: 'buy',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (!activeAccount) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Trading Account</h3>
          <p className="text-muted-foreground">
            Create a trading account to start paper trading
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paper Trading</h1>
          <p className="text-muted-foreground">Practice trading with virtual AUD funds</p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          Balance: {formatCurrency(activeAccount.balance)}
        </Badge>
      </div>

      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trade">Make Trade</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execute Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="asset">Cryptocurrency</Label>
                  <Select value={tradeData.symbol} onValueChange={(value) => setTradeData({ ...tradeData, symbol: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoAssets.map(asset => (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          <div className="flex items-center justify-between w-full">
                            <span>{asset.symbol} - {asset.name}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              {formatCurrency(asset.price)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Order Type</Label>
                    <Select value={tradeData.type} onValueChange={(value: 'buy' | 'sell') => setTradeData({ ...tradeData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Buy
                          </div>
                        </SelectItem>
                        <SelectItem value="sell">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Sell
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.00000001"
                      value={tradeData.quantity}
                      onChange={(e) => setTradeData({ ...tradeData, quantity: e.target.value })}
                      placeholder="0.001"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Trade Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={tradeData.date}
                    onChange={(e) => setTradeData({ ...tradeData, date: e.target.value })}
                  />
                </div>

                {selectedAsset && tradeData.quantity && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Current Price:</span>
                      <span className="font-semibold">{formatCurrency(selectedAsset.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Value:</span>
                      <span className="font-semibold text-lg">{formatCurrency(totalValue)}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleTrade} 
                  className="w-full"
                  disabled={!tradeData.symbol || !tradeData.quantity}
                >
                  {tradeData.type === 'buy' ? 'Buy' : 'Sell'} {tradeData.symbol}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cryptoAssets.map(asset => {
                    const change = (Math.random() - 0.5) * 10; // Mock 24h change
                    return (
                      <div key={asset.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(asset.price)}</div>
                          <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <TradingHoldings />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAccount.trades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trades yet. Execute your first trade to see history here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...activeAccount.trades].reverse().map(trade => (
                    <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {trade.type === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-semibold">
                            {trade.type.toUpperCase()} {trade.symbol || trade.coinSymbol}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(trade.quantity || trade.amount).toFixed(6)} units @ {formatCurrency(trade.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(trade.totalValue)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFakeTrading;
