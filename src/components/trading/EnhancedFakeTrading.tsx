
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useRealTimeMarketData } from '@/hooks/useRealTimeMarketData';
import { Trade } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

interface EnhancedFakeTradingProps {
  onTrade?: (trade: Trade) => void;
}

const EnhancedFakeTrading: React.FC<EnhancedFakeTradingProps> = ({ onTrade }) => {
  const { toast } = useToast();
  const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
  const { marketData, isLoading, error } = useRealTimeMarketData(symbols);
  
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(10000);

  const marketDataArray = Object.values(marketData);
  const currentPrice = marketData[selectedSymbol]?.price || 0;

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid trade amount',
        variant: 'destructive'
      });
      return;
    }

    const tradeAmount = parseFloat(amount);
    const totalValue = tradeAmount * currentPrice;

    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Not enough balance for this trade',
        variant: 'destructive'
      });
      return;
    }

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: selectedSymbol,
      type: tradeType,
      quantity: tradeAmount,
      price: currentPrice,
      totalValue,
      timestamp: new Date().toISOString(),
      fees: totalValue * 0.001 // 0.1% fee
    };

    // Update balance
    if (tradeType === 'buy') {
      setBalance(prev => prev - totalValue - trade.fees!);
    } else {
      setBalance(prev => prev + totalValue - trade.fees!);
    }

    if (onTrade) {
      onTrade(trade);
    }
    setAmount('');
    
    toast({
      title: 'Trade Executed',
      description: `${tradeType.toUpperCase()} ${tradeAmount} ${selectedSymbol} at $${currentPrice.toFixed(2)}`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enhanced Fake Trading</span>
            <Badge variant="secondary">
              <DollarSign className="h-3 w-3 mr-1" />
              Balance: ${balance.toFixed(2)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Data Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {marketDataArray.map((data) => (
              <Card key={data.symbol} className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold">{data.symbol}</h3>
                  <p className="text-2xl font-bold">${data.price.toFixed(2)}</p>
                  <div className={`flex items-center justify-center gap-1 ${
                    data.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-sm">{data.change24h.toFixed(2)}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trading Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Symbol</label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={tradeType} onValueChange={(value: 'buy' | 'sell') => setTradeType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleTrade} className="w-full" disabled={isLoading}>
                Execute Trade
              </Button>
            </div>
          </div>

          {/* Current Selection Info */}
          {selectedSymbol && marketData[selectedSymbol] && (
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedSymbol} Trading Info</h3>
                  <p>Current Price: ${currentPrice.toFixed(2)}</p>
                  <p>24h Change: {marketData[selectedSymbol].change24h.toFixed(2)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-semibold">
                    ${amount ? (parseFloat(amount) * currentPrice).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFakeTrading;
