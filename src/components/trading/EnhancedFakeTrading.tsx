
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CoinOption, SupportedCurrency } from '@/types/trading';
import TradingForm from "./TradingForm";
import TradeHistory from "./TradeHistory";
import TradingStats from "./TradingStats";
import RealTimePriceChart from "./RealTimePriceChart";
import { LineChart, Clock, BarChart4, Settings, Activity } from 'lucide-react';

const EnhancedFakeTrading: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("trade");
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");
  const [balance, setBalance] = useState<number>(10000);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>("USD");

  // Sample coins data
  const availableCoins: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32, 
      priceChange: 1200,
      changePercent: 2.3,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000,
      marketCap: 1180000000000,
      value: "BTC",
      label: "Bitcoin (BTC)"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      priceChange: -120,
      changePercent: -1.5,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 15000000000,
      marketCap: 360000000000,
      value: "ETH",
      label: "Ethereum (ETH)"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 121.33,
      priceChange: 3.56,
      changePercent: 3.1,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 5200000000,
      marketCap: 90000000000,
      value: "SOL",
      label: "Solana (SOL)"
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      priceChange: -0.02,
      changePercent: -2.6,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      volume: 890000000,
      marketCap: 24000000000,
      value: "ADA",
      label: "Cardano (ADA)"
    }
  ];

  const [holdingsMap, setHoldingsMap] = useState<{[key: string]: number}>({
    "bitcoin": 0.1,
    "ethereum": 1.5,
    "solana": 5.0,
    "cardano": 0.0
  });

  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    return Object.entries(holdingsMap).reduce((total, [coinId, amount]) => {
      const coin = availableCoins.find(c => c.id === coinId);
      return total + (coin ? coin.price * amount : 0);
    }, balance);
  };

  // Execute a trade
  const executeTrade = (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => {
    const totalValue = amount * price;
    const coin = availableCoins.find(c => c.id === coinId);
    
    if (!coin) {
      toast({
        title: "Error",
        description: "Coin not found",
        variant: "destructive",
      });
      return;
    }

    // Check if trade is valid
    if (type === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough funds for this trade",
        variant: "destructive",
      });
      return;
    }

    if (type === 'sell' && (holdingsMap[coinId] || 0) < amount) {
      toast({
        title: "Insufficient Holdings",
        description: `You don't have enough ${coin.symbol} for this trade`,
        variant: "destructive",
      });
      return;
    }

    // Update balance
    const newBalance = type === 'buy' 
      ? balance - totalValue 
      : balance + totalValue;
    setBalance(newBalance);

    // Update holdings
    setHoldingsMap(prev => ({
      ...prev,
      [coinId]: (prev[coinId] || 0) + (type === 'buy' ? amount : -amount)
    }));

    // Add to trade history
    const trade = {
      id: `trade-${Date.now()}`,
      coinId,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      type,
      amount,
      price,
      totalValue,
      timestamp: new Date().toISOString(),
      currency: activeCurrency
    };
    setTradeHistory([trade, ...tradeHistory]);

    toast({
      title: `${type === 'buy' ? 'Purchase' : 'Sale'} Successful`,
      description: `${type === 'buy' ? 'Bought' : 'Sold'} ${amount} ${coin.symbol} for $${totalValue.toFixed(2)}`,
    });
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get owned amount of a specific coin
  const getOwnedCoinAmount = (coinId: string) => {
    return holdingsMap[coinId] || 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Enhanced Trading Simulator
        </CardTitle>
        <CardDescription>
          Practice trading with virtual funds in a realistic environment
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="trade">
              <LineChart className="h-4 w-4 mr-2" />
              Trade
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart4 className="h-4 w-4 mr-2" />
              Chart
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trade">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TradingForm
                  balance={balance}
                  availableCoins={availableCoins}
                  onTrade={executeTrade}
                  getOwnedCoinAmount={getOwnedCoinAmount}
                  activeCurrency={activeCurrency}
                  onCurrencyChange={setActiveCurrency}
                  conversionRate={1}
                />
              </div>
              <div>
                <TradingStats
                  balance={balance}
                  portfolioValue={calculatePortfolioValue()}
                  holdings={holdingsMap}
                  coins={availableCoins}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <RealTimePriceChart
              coinId={selectedCoinId}
              availableCoins={availableCoins}
              onSelectCoin={setSelectedCoinId}
            />
          </TabsContent>

          <TabsContent value="history">
            <TradeHistory
              trades={tradeHistory}
              formatCurrency={formatCurrency}
              activeCurrency={activeCurrency}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Account Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span>Reset Portfolio</span>
                      <Button variant="destructive" size="sm" onClick={() => {
                        setBalance(10000);
                        setHoldingsMap({
                          "bitcoin": 0,
                          "ethereum": 0,
                          "solana": 0,
                          "cardano": 0
                        });
                        setTradeHistory([]);
                        toast({
                          title: "Portfolio Reset",
                          description: "Your portfolio has been reset to the initial state",
                        });
                      }}>
                        Reset
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span>Add Funds</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        setBalance(balance + 10000);
                        toast({
                          title: "Funds Added",
                          description: "$10,000 has been added to your account",
                        });
                      }}>
                        Add $10,000
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Statistics</h3>
                  <div className="p-3 bg-muted/50 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Trades:</span>
                      <span>{tradeHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Balance:</span>
                      <span>$10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span>${calculatePortfolioValue().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit/Loss:</span>
                      <span className={calculatePortfolioValue() > 10000 ? "text-green-500" : "text-red-500"}>
                        {(calculatePortfolioValue() - 10000).toFixed(2)} ({((calculatePortfolioValue() / 10000 - 1) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Balance: ${balance.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">
          Portfolio: ${calculatePortfolioValue().toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedFakeTrading;
