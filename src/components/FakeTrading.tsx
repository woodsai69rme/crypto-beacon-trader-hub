
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currentValue?: number;
  profitLoss?: number;
}

interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

const FakeTrading = () => {
  const [trades, setTrades] = useLocalStorage<Trade[]>("fakeTradingHistory", []);
  const [balance, setBalance] = useLocalStorage<number>("fakeTradingBalance", 10000);
  const [amount, setAmount] = useState<number>(0);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Available coins with mock prices
  const availableCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
  ];

  // Get selected coin data
  const getSelectedCoinData = (): CoinOption | undefined => {
    return availableCoins.find(coin => coin.id === selectedCoin);
  };

  // Calculate total owned coins
  const getOwnedCoinAmount = (coinId: string): number => {
    return trades
      .filter(trade => trade.coinId === coinId)
      .reduce((total, trade) => {
        if (trade.type === 'buy') {
          return total + trade.amount;
        } else {
          return total - trade.amount;
        }
      }, 0);
  };

  // Execute trade
  const executeTrade = () => {
    if (!selectedCoin || amount <= 0) {
      toast({
        title: "Invalid Trade",
        description: "Please select a coin and enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const coinData = getSelectedCoinData();
    if (!coinData) return;

    const totalValue = amount * coinData.price;

    // Validate trade
    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(totalValue)} but only have ${formatCurrency(balance)} available`,
        variant: "destructive",
      });
      return;
    }

    if (tradeType === 'sell' && amount > getOwnedCoinAmount(selectedCoin)) {
      toast({
        title: "Insufficient Coins",
        description: `You don't have enough ${coinData.symbol} to sell`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newTrade: Trade = {
        id: Date.now().toString(),
        coinId: coinData.id,
        coinName: coinData.name,
        coinSymbol: coinData.symbol,
        type: tradeType,
        amount: amount,
        price: coinData.price,
        totalValue: totalValue,
        timestamp: new Date().toISOString(),
      };

      // Update trades history
      setTrades([newTrade, ...trades]);

      // Update balance
      if (tradeType === 'buy') {
        setBalance(balance - totalValue);
      } else {
        setBalance(balance + totalValue);
      }

      // Reset form
      setAmount(0);
      
      // Show success message
      toast({
        title: "Trade Executed",
        description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${coinData.symbol}`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Calculate portfolio value
  const calculatePortfolioValue = (): number => {
    let totalValue = balance;
    
    // Group trades by coin
    const coinHoldings: { [key: string]: number } = {};
    
    trades.forEach(trade => {
      if (!coinHoldings[trade.coinId]) {
        coinHoldings[trade.coinId] = 0;
      }
      
      if (trade.type === 'buy') {
        coinHoldings[trade.coinId] += trade.amount;
      } else {
        coinHoldings[trade.coinId] -= trade.amount;
      }
    });
    
    // Calculate value of holdings
    Object.keys(coinHoldings).forEach(coinId => {
      const coin = availableCoins.find(c => c.id === coinId);
      if (coin && coinHoldings[coinId] > 0) {
        totalValue += coin.price * coinHoldings[coinId];
      }
    });
    
    return totalValue;
  };

  // Reset trading system
  const resetTradingSystem = () => {
    if (confirm("Are you sure you want to reset your trading history and balance?")) {
      setTrades([]);
      setBalance(10000);
      toast({
        title: "Trading System Reset",
        description: "Your trading history and balance have been reset to the initial state",
      });
    }
  };

  // Calculate performance
  const calculatePerformance = (): number => {
    const initialBalance = 10000;
    const currentValue = calculatePortfolioValue();
    return ((currentValue - initialBalance) / initialBalance) * 100;
  };

  // Update current values for trades
  useEffect(() => {
    const updatedTrades = trades.map(trade => {
      const currentPrice = availableCoins.find(coin => coin.id === trade.coinId)?.price || trade.price;
      const currentValue = trade.amount * currentPrice;
      const profitLoss = trade.type === 'buy' 
        ? currentValue - trade.totalValue 
        : trade.totalValue - currentValue;
        
      return {
        ...trade,
        currentValue,
        profitLoss
      };
    });
    
    if (JSON.stringify(updatedTrades) !== JSON.stringify(trades)) {
      setTrades(updatedTrades);
    }
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fake Trading System</CardTitle>
        <CardDescription>Practice trading without real money</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold">{formatCurrency(calculatePortfolioValue())}</div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Performance</div>
            <div className={`text-2xl font-bold flex items-center ${calculatePerformance() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {calculatePerformance() >= 0 ? (
                <ArrowUp className="mr-1 h-5 w-5" />
              ) : (
                <ArrowDown className="mr-1 h-5 w-5" />
              )}
              {Math.abs(calculatePerformance()).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Execute Trade</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Trade Type</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      className={tradeType === 'buy' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
                      onClick={() => setTradeType('buy')}
                    >
                      Buy
                    </Button>
                    <Button 
                      variant={tradeType === 'sell' ? 'default' : 'outline'}
                      className={tradeType === 'sell' ? 'flex-1 bg-red-600 hover:bg-red-700' : 'flex-1'}
                      onClick={() => setTradeType('sell')}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Cryptocurrency</label>
                  <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCoins.map(coin => (
                        <SelectItem key={coin.id} value={coin.id}>
                          {coin.symbol} - {coin.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Amount</label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.0001"
                    value={amount || ''}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">Price</label>
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center">
                      {selectedCoin ? `$${getSelectedCoinData()?.price.toLocaleString()}` : 'Select a coin'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">Total Value</label>
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center font-medium">
                      {selectedCoin && amount > 0 
                        ? formatCurrency(amount * (getSelectedCoinData()?.price || 0)) 
                        : '$0.00'}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={executeTrade} 
                  disabled={isLoading || !selectedCoin || amount <= 0}
                  variant={tradeType === 'buy' ? 'default' : 'destructive'}
                >
                  {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCoin ? getSelectedCoinData()?.symbol : ''}`}
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Your Holdings</h3>
              <Button variant="outline" size="sm" onClick={resetTradingSystem}>
                Reset
              </Button>
            </div>
            
            <div className="space-y-2">
              {availableCoins.map(coin => {
                const ownedAmount = getOwnedCoinAmount(coin.id);
                if (ownedAmount <= 0) return null;
                
                const value = ownedAmount * coin.price;
                const buyTrades = trades.filter(t => t.coinId === coin.id && t.type === 'buy');
                const sellTrades = trades.filter(t => t.coinId === coin.id && t.type === 'sell');
                
                // Calculate average buy price
                const totalBuyAmount = buyTrades.reduce((sum, t) => sum + t.amount, 0);
                const totalBuyValue = buyTrades.reduce((sum, t) => sum + t.totalValue, 0);
                const avgBuyPrice = totalBuyAmount > 0 ? totalBuyValue / totalBuyAmount : 0;
                
                // Calculate profit/loss
                const profitLoss = value - (ownedAmount * avgBuyPrice);
                const profitLossPercentage = avgBuyPrice > 0 ? (profitLoss / (ownedAmount * avgBuyPrice)) * 100 : 0;
                
                return (
                  <div key={coin.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{coin.symbol}</div>
                        <div className="text-xs text-muted-foreground">{ownedAmount.toFixed(6)} {coin.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(value)}</div>
                      <div className={`text-xs flex items-center justify-end ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {profitLoss >= 0 ? (
                          <ArrowUp className="mr-0.5 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-0.5 h-3 w-3" />
                        )}
                        {formatCurrency(Math.abs(profitLoss))} ({Math.abs(profitLossPercentage).toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {!availableCoins.some(coin => getOwnedCoinAmount(coin.id) > 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You don't have any holdings yet.</p>
                  <p className="text-sm">Start buying some crypto to build your portfolio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-3">Recent Trades</h3>
          {trades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Coin</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-right">Current</th>
                    <th className="px-4 py-2 text-right">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.slice(0, 10).map((trade) => {
                    const date = new Date(trade.timestamp);
                    const isProfitable = trade.profitLoss ? trade.profitLoss > 0 : false;
                    
                    return (
                      <tr key={trade.id} className="border-b">
                        <td className="px-4 py-2">
                          {date.toLocaleDateString()} {date.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`font-medium ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.type === 'buy' ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{trade.coinSymbol}</td>
                        <td className="px-4 py-2 text-right">{trade.amount.toFixed(6)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(trade.price)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(trade.totalValue)}</td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(trade.currentValue || trade.totalValue)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {trade.profitLoss && (
                            <span className={isProfitable ? 'text-green-500' : 'text-red-500'}>
                              {formatCurrency(Math.abs(trade.profitLoss))}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No trade history yet.</p>
              <p className="text-sm">Execute your first trade to see the history.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FakeTrading;
