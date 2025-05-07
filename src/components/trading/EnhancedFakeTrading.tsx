
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRightLeft, ChevronUp, ChevronDown, BarChart2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  image: string;
  volume: number;
  marketCap: number;
  value: string;
  label: string;
}

// Update the mockCoins array to include changePercent for all coins
const mockCoins: CoinOption[] = [
  {
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 58352.12, 
    priceChange: 1245.32, 
    changePercent: 2.18, 
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 48941516789,
    marketCap: 1143349097968,
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  {
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3105.78, 
    priceChange: 65.43, 
    changePercent: 2.15, 
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    volume: 21891456789,
    marketCap: 373952067386,
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  {
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.45, 
    priceChange: -0.01, 
    changePercent: -2.17, 
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    volume: 467891234,
    marketCap: 15893456789,
    value: "cardano",
    label: "Cardano (ADA)"
  },
  {
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 152.37, 
    priceChange: 5.23, 
    changePercent: 3.55, 
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    volume: 3578912345,
    marketCap: 67891234567,
    value: "solana",
    label: "Solana (SOL)"
  }
];

const EnhancedFakeTrading: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption>(mockCoins[0]);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [executingTrade, setExecutingTrade] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setAmount(value);
    }
  };
  
  const handleTradeSubmit = () => {
    if (!selectedCoin || !amount || Number(amount) <= 0) {
      toast({
        title: "Trade Error",
        description: "Please enter a valid amount to trade",
        variant: "destructive"
      });
      return;
    }
    
    setExecutingTrade(true);
    
    // Simulate trade execution
    setTimeout(() => {
      const total = Number(amount) * selectedCoin.price;
      
      toast({
        title: `${tradeType === 'buy' ? 'Buy' : 'Sell'} Order Executed`,
        description: `Successfully ${tradeType === 'buy' ? 'purchased' : 'sold'} ${amount} ${selectedCoin.symbol} for $${total.toFixed(2)}`,
      });
      
      setExecutingTrade(false);
      setAmount('');
    }, 1500);
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setLimitPrice(value);
    }
  };
  
  const handleStopLossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setStopLossPrice(value);
    }
  };
  
  const handleTakeProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setTakeProfitPrice(value);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Cryptocurrency</CardTitle>
        <CardDescription>Buy and sell cryptocurrencies with advanced trading options</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trade">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trade" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coin-select">Select Cryptocurrency</Label>
                <Select 
                  value={selectedCoin.id}
                  onValueChange={(value) => {
                    const coin = mockCoins.find(c => c.id === value);
                    if (coin) setSelectedCoin(coin);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCoins.map(coin => (
                      <SelectItem key={coin.id} value={coin.id}>
                        <div className="flex items-center gap-2">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-5 h-5 rounded-full"
                          />
                          {coin.name} ({coin.symbol})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCoin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-bold">${selectedCoin.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Change</p>
                    <p className={`text-xl font-bold flex items-center ${
                      selectedCoin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {selectedCoin.priceChange >= 0 ? (
                        <ChevronUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(selectedCoin.changePercent).toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="trade-type">Trade Type</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={tradeType === 'buy' ? "default" : "outline"}
                    className={`w-full ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? "default" : "outline"}
                    className={`w-full ${tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={() => setTradeType('sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                  <div className="bg-muted flex items-center justify-center px-3 rounded-md">
                    {selectedCoin.symbol}
                  </div>
                </div>
                
                {selectedCoin && amount && !isNaN(Number(amount)) && (
                  <div className="text-sm text-muted-foreground">
                    Total Value: ${(Number(amount) * selectedCoin.price).toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
                <Label htmlFor="advanced-mode">Advanced Trading Options</Label>
              </div>
              
              {showAdvanced && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-type">Order Type</Label>
                    <Select
                      value={orderType}
                      onValueChange={setOrderType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {orderType === 'limit' && (
                    <div className="space-y-2">
                      <Label htmlFor="limit-price">Limit Price</Label>
                      <Input
                        id="limit-price"
                        type="text"
                        placeholder="0.00"
                        value={limitPrice}
                        onChange={handleLimitPriceChange}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Risk Management</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="stop-loss" className="text-xs">Stop Loss</Label>
                        <Input
                          id="stop-loss"
                          type="text"
                          placeholder="0.00"
                          value={stopLossPrice}
                          onChange={handleStopLossChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="take-profit" className="text-xs">Take Profit</Label>
                        <Input
                          id="take-profit"
                          type="text"
                          placeholder="0.00"
                          value={takeProfitPrice}
                          onChange={handleTakeProfitChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleTradeSubmit}
                disabled={executingTrade || !amount || Number(amount) <= 0}
              >
                {executingTrade ? "Processing..." : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCoin.symbol}`}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="text-center py-6">
              <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No active orders</p>
              <Button variant="outline" className="mt-4">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Go to Trade
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-6">
              <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No trade history</p>
              <Button variant="outline" className="mt-4">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Go to Trade
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedFakeTrading;
