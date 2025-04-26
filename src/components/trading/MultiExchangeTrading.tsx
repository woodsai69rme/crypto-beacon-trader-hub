
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Exchange, ArrowUpDown, Search } from "lucide-react";
import CurrencySelector from "@/components/trading/CurrencySelector";
import TradeValueDisplay from "@/components/trading/TradeValueDisplay";

interface Exchange {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  pairs: string[];
}

interface ArbitrageOpportunity {
  id: string;
  pair: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  difference: number;
  percentDiff: number;
  volume24h: number;
}

const MultiExchangeTrading = () => {
  const [selectedExchange, setSelectedExchange] = useState("binance");
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [orderType, setOrderType] = useState("limit");
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: "binance",
      name: "Binance",
      logo: "🟡",
      connected: true,
      pairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"]
    },
    {
      id: "coinbase",
      name: "Coinbase",
      logo: "🔵",
      connected: true,
      pairs: ["BTC/USD", "ETH/USD", "SOL/USD"]
    },
    {
      id: "kraken",
      name: "Kraken",
      logo: "🟣",
      connected: false,
      pairs: ["BTC/USD", "ETH/USD", "XRP/USD"]
    },
    {
      id: "kucoin",
      name: "KuCoin",
      logo: "🟢",
      connected: false,
      pairs: ["BTC/USDT", "ETH/USDT", "ADA/USDT"]
    }
  ]);
  
  const [opportunities] = useState<ArbitrageOpportunity[]>([
    {
      id: "arb1",
      pair: "BTC/USDT",
      buyExchange: "Coinbase",
      sellExchange: "Binance",
      buyPrice: 87423.50,
      sellPrice: 87576.25,
      difference: 152.75,
      percentDiff: 0.175,
      volume24h: 432.5
    },
    {
      id: "arb2",
      pair: "ETH/USDT",
      buyExchange: "Kraken",
      sellExchange: "KuCoin",
      buyPrice: 3241.75,
      sellPrice: 3256.30,
      difference: 14.55,
      percentDiff: 0.448,
      volume24h: 876.3
    },
    {
      id: "arb3",
      pair: "SOL/USDT",
      buyExchange: "Binance",
      sellExchange: "Coinbase",
      buyPrice: 142.35,
      sellPrice: 143.15,
      difference: 0.8,
      percentDiff: 0.562,
      volume24h: 1254.7
    }
  ]);
  
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "AUD">("USD");
  
  const handleConnectExchange = (exchangeId: string) => {
    toast({
      title: "Connect Exchange",
      description: "Please add your API keys for this exchange",
    });
  };
  
  const handleTrade = (type: "buy" | "sell") => {
    if (!quantity || !price) {
      toast({
        title: "Missing Fields",
        description: "Please enter quantity and price for your order",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Order Placed",
      description: `${type.toUpperCase()} order for ${quantity} ${selectedPair.split('/')[0]} at ${price} ${selectedPair.split('/')[1]}`
    });
  };
  
  const handleArbitrage = (id: string) => {
    const opportunity = opportunities.find(o => o.id === id);
    
    if (opportunity) {
      toast({
        title: "Arbitrage Bot Activated",
        description: `Monitoring ${opportunity.pair} between ${opportunity.buyExchange} and ${opportunity.sellExchange}`
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Exchange Trading</CardTitle>
        <CardDescription>Trade across multiple exchanges from a single interface</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trade" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="trade">Exchange Trading</TabsTrigger>
            <TabsTrigger value="portfolio">Cross-Exchange Portfolio</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trade">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-3">Exchange Selection</h4>
                  <div className="grid gap-4">
                    {exchanges.map(exchange => (
                      <div 
                        key={exchange.id} 
                        className={`flex items-center justify-between p-3 rounded-md border-2 cursor-pointer ${selectedExchange === exchange.id ? 'border-primary' : 'border-transparent hover:bg-muted'}`}
                        onClick={() => exchange.connected ? setSelectedExchange(exchange.id) : handleConnectExchange(exchange.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{exchange.logo}</span>
                          <span>{exchange.name}</span>
                        </div>
                        
                        {exchange.connected ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Connected
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Currency
                  </div>
                  <CurrencySelector 
                    activeCurrency={activeCurrency}
                    onCurrencyChange={setActiveCurrency}
                  />
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Exchange Info</h4>
                    <Badge variant="outline">
                      {exchanges.find(e => e.id === selectedExchange)?.name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Maker Fee</div>
                      <div className="font-medium">0.1%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Taker Fee</div>
                      <div className="font-medium">0.1%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min. Order</div>
                      <div className="font-medium">10 USDT</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min. Trade</div>
                      <div className="font-medium">0.0001 BTC</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-medium">{selectedPair}</h3>
                    <div className="text-sm text-muted-foreground">
                      Current Price: 87,423.50 USDT
                    </div>
                  </div>
                  
                  <Select value={selectedPair} onValueChange={setSelectedPair}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {exchanges
                        .find(e => e.id === selectedExchange)
                        ?.pairs.map(pair => (
                          <SelectItem key={pair} value={pair}>
                            {pair}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Order Form</h4>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="stop">Stop Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="quantity">Quantity ({selectedPair.split('/')[0]})</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        placeholder="0.00" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    
                    {orderType !== "market" && (
                      <div className="grid gap-3">
                        <Label htmlFor="price">Price ({selectedPair.split('/')[1]})</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder="0.00" 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {quantity && price && (
                      <TradeValueDisplay
                        label="Total Value"
                        value={`${(Number(quantity) * Number(price)).toLocaleString()} ${selectedPair.split('/')[1]}`}
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleTrade("buy")}
                      >
                        Buy
                      </Button>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => handleTrade("sell")}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Advanced Options</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="post-only">Post Only</Label>
                        <div className="text-xs text-muted-foreground">
                          Ensures your order is added to the order book as a maker
                        </div>
                      </div>
                      <Switch id="post-only" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-only">Reduce Only</Label>
                        <div className="text-xs text-muted-foreground">
                          Order will only reduce your position, not increase it
                        </div>
                      </div>
                      <Switch id="reduce-only" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Cross-Exchange Portfolio</h3>
                <Button variant="outline">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Transfer Funds
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🟡</span>
                      <h4 className="font-medium">Binance</h4>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">BTC</span>
                        <span>0.3428 ($29,549.85)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ETH</span>
                        <span>4.3214 ($13,892.76)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">USDT</span>
                        <span>12,435.32</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <span className="text-muted-foreground text-sm">Total Value</span>
                      <span className="font-bold">${(29549.85 + 13892.76 + 12435.32).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔵</span>
                      <h4 className="font-medium">Coinbase</h4>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">BTC</span>
                        <span>0.1252 ($10,832.49)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ETH</span>
                        <span>2.1108 ($6,781.12)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">USD</span>
                        <span>8,721.43</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <span className="text-muted-foreground text-sm">Total Value</span>
                      <span className="font-bold">${(10832.49 + 6781.12 + 8721.43).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="sm:col-span-2 xl:col-span-2">
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Portfolio Distribution</h4>
                    <div className="flex justify-center items-center h-48">
                      <div className="text-center text-muted-foreground">
                        Chart visualization would appear here
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div>
                        <div className="text-muted-foreground text-sm">Total Portfolio Value</div>
                        <div className="text-2xl font-bold">${(29549.85 + 13892.76 + 12435.32 + 10832.49 + 6781.12 + 8721.43).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-sm">24h Change</div>
                        <div className="text-lg font-medium text-green-500">+$4,321.52 (+5.3%)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="arbitrage">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Arbitrage Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time arbitrage opportunities across connected exchanges
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search pairs..." 
                      className="pl-9 w-[180px]"
                    />
                  </div>
                  <Button>
                    <Exchange className="h-4 w-4 mr-2" />
                    Auto Arbitrage
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {opportunities.map(opp => (
                  <Card key={opp.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{opp.pair}</h3>
                            <Badge variant="secondary" className="text-green-500">
                              +{opp.percentDiff.toFixed(2)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Buy on <span className="font-medium">{opp.buyExchange}</span> at ${opp.buyPrice.toLocaleString()} • 
                            Sell on <span className="font-medium">{opp.sellExchange}</span> at ${opp.sellPrice.toLocaleString()}
                          </p>
                        </div>
                        <Button onClick={() => handleArbitrage(opp.id)}>
                          Start Bot
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Price Difference</div>
                          <div className="font-medium text-green-500">+${opp.difference.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">24h Volume</div>
                          <div className="font-medium">{opp.volume24h.toLocaleString()} BTC</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Estimated Profit (1 BTC)</div>
                          <div className="font-medium text-green-500">+${(opp.difference).toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="border rounded-md p-4 mt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Arbitrage Bot Settings</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure automated arbitrage execution
                    </p>
                  </div>
                  <Badge>PREMIUM</Badge>
                </div>
                
                <div className="grid gap-4 mt-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-profit">Minimum Profit Threshold</Label>
                    <div className="flex items-center w-32">
                      <Input 
                        id="min-profit" 
                        type="number" 
                        placeholder="0.2" 
                        defaultValue="0.2"
                        className="text-right"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-order">Maximum Order Size</Label>
                    <div className="flex items-center w-32">
                      <Input 
                        id="max-order" 
                        type="number" 
                        placeholder="0.5" 
                        defaultValue="0.5"
                        className="text-right"
                      />
                      <span className="ml-2">BTC</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-execute">Auto-Execute Trades</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically execute when threshold is met
                      </p>
                    </div>
                    <Switch id="auto-execute" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Trade Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Get alerts for completed arbitrage trades
                      </p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiExchangeTrading;
