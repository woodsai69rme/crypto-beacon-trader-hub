
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { normalizeCoinOption } from './helpers';

// Importing CoinOption from our types file
import { CoinOption } from '@/components/trading/types';

interface RealTimeTradingProps {
  selectedCoin?: CoinOption;
  onCoinSelect?: (coin: CoinOption) => void;
}

const RealTimeTrading: React.FC<RealTimeTradingProps> = ({ selectedCoin, onCoinSelect }) => {
  // Mock coin data
  const mockCoins: CoinOption[] = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: 65432.10,
      priceChange: 2341.50,
      changePercent: 3.7,
      volume: 32456789012,
      marketCap: 1234567890123,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)'
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: 3421.45,
      priceChange: 145.30,
      changePercent: 4.2,
      volume: 15678901234,
      marketCap: 413456789012,
      value: 'ethereum',
      label: 'Ethereum (ETH)'
    },
    { 
      id: 'solana', 
      name: 'Solana', 
      symbol: 'SOL', 
      price: 142.35,
      priceChange: 12.35,
      changePercent: 9.5,
      volume: 5678901234,
      marketCap: 76543210987,
      value: 'solana',
      label: 'Solana (SOL)'
    }
  ];

  const [availableCoins] = useState<CoinOption[]>(mockCoins.map(normalizeCoinOption));
  const [activeCoin, setActiveCoin] = useState<CoinOption | undefined>(selectedCoin || availableCoins[0]);
  const [amount, setAmount] = useState<string>('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [balance] = useState<number>(10000);
  
  useEffect(() => {
    if (selectedCoin) {
      setActiveCoin(selectedCoin);
    }
  }, [selectedCoin]);
  
  const handleCoinSelect = (coinId: string) => {
    const coin = availableCoins.find((c) => c.id === coinId);
    if (coin) {
      setActiveCoin(coin);
      if (onCoinSelect) {
        onCoinSelect(coin);
      }
      
      // Reset form values when changing coins
      setAmount('');
      setLimitPrice(coin.price.toString());
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setLimitPrice(value);
    }
  };
  
  const calculateTotal = (): number => {
    const amountValue = parseFloat(amount) || 0;
    const priceValue = orderType === 'market' 
      ? (activeCoin?.price || 0) 
      : (parseFloat(limitPrice) || 0);
    
    return amountValue * priceValue;
  };
  
  const canSubmitOrder = (): boolean => {
    const amountValue = parseFloat(amount) || 0;
    const total = calculateTotal();
    const validAmount = amountValue > 0;
    const validLimitPrice = orderType === 'market' || (parseFloat(limitPrice) > 0);
    const canAfford = tradeType === 'buy' ? total <= balance : true;
    
    return validAmount && validLimitPrice && canAfford;
  };
  
  const handlePlaceOrder = () => {
    if (!canSubmitOrder() || !activeCoin) return;
    
    const amountValue = parseFloat(amount);
    const priceValue = orderType === 'market' 
      ? activeCoin.price 
      : parseFloat(limitPrice);
    const total = amountValue * priceValue;
    
    toast({
      title: "Order Placed",
      description: `Successfully placed ${tradeType} order for ${amountValue} ${activeCoin.symbol} at ${priceValue}`
    });
    
    // Reset form after order
    setAmount('');
    if (orderType === 'limit') {
      setLimitPrice('');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coin Selection */}
          <div className="space-y-6">
            <div>
              <Label>Select Asset</Label>
              <Select
                value={activeCoin?.id || ''}
                onValueChange={handleCoinSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoins.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {activeCoin && (
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-medium">{activeCoin.symbol}/USD</span>
                  <div className="text-right">
                    <div className="text-lg font-bold">${activeCoin.price.toLocaleString()}</div>
                    <div className={`flex items-center text-sm ${activeCoin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {activeCoin.priceChange >= 0 ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {activeCoin.priceChange >= 0 ? '+' : ''}
                      {activeCoin.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Market Cap</p>
                    <p>${(activeCoin.marketCap / 1_000_000_000).toFixed(1)}B</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volume (24h)</p>
                    <p>${(activeCoin.volume / 1_000_000_000).toFixed(1)}B</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Account Balance</Label>
                <span className="font-medium">${balance.toLocaleString()}</span>
              </div>
              <div className="bg-muted h-2 rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
          
          {/* Trading Form */}
          <div className="space-y-6">
            <Tabs defaultValue="buy" onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Sell
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={orderType === 'market' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrderType('market')}
                    className="flex-1"
                  >
                    Market
                  </Button>
                  <Button
                    variant={orderType === 'limit' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrderType('limit')}
                    className="flex-1"
                  >
                    Limit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({activeCoin?.symbol})</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (tradeType === 'buy' && activeCoin) {
                          // Set to 25% of balance in the active coin
                          const maxAmount = (balance * 0.25) / activeCoin.price;
                          setAmount(maxAmount.toFixed(6));
                        }
                      }}
                    >
                      25%
                    </Button>
                  </div>
                </div>
                
                {orderType === 'limit' && (
                  <div className="space-y-2">
                    <Label htmlFor="limit-price">Limit Price (USD)</Label>
                    <Input
                      id="limit-price"
                      value={limitPrice}
                      onChange={handleLimitPriceChange}
                      placeholder={activeCoin?.price.toString() || "0.00"}
                    />
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Estimated Total</span>
                    <span className="font-medium">${calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  <Button
                    className="w-full mt-2"
                    disabled={!canSubmitOrder()}
                    onClick={handlePlaceOrder}
                  >
                    Place {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} Order
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
          
          {/* Order Book */}
          <div className="space-y-4">
            <h3 className="font-medium">Order Book</h3>
            <div className="border rounded-md overflow-hidden">
              {/* Sell Orders */}
              <div className="p-2 border-b">
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground mb-1">
                  <div>Price (USD)</div>
                  <div className="text-right">Amount ({activeCoin?.symbol})</div>
                  <div className="text-right">Total (USD)</div>
                </div>
                <div className="space-y-1">
                  {/* Mock sell orders - would be generated dynamically */}
                  {activeCoin && [1.05, 1.04, 1.03, 1.02, 1.01].map((multiplier, index) => {
                    const price = activeCoin.price * multiplier;
                    const amount = 0.5 + Math.random() * 2;
                    const total = price * amount;
                    
                    return (
                      <div key={`sell-${index}`} className="grid grid-cols-3 text-xs">
                        <div className="text-red-500">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="text-right">{amount.toFixed(4)}</div>
                        <div className="text-right">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Current Price */}
              <div className="bg-muted py-1 px-2 border-b">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Current Price</span>
                  <span>${activeCoin?.price.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Buy Orders */}
              <div className="p-2">
                <div className="space-y-1">
                  {/* Mock buy orders - would be generated dynamically */}
                  {activeCoin && [0.99, 0.98, 0.97, 0.96, 0.95].map((multiplier, index) => {
                    const price = activeCoin.price * multiplier;
                    const amount = 0.5 + Math.random() * 2;
                    const total = price * amount;
                    
                    return (
                      <div key={`buy-${index}`} className="grid grid-cols-3 text-xs">
                        <div className="text-green-500">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="text-right">{amount.toFixed(4)}</div>
                        <div className="text-right">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeTrading;
