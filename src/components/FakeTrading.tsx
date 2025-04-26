
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import TradingForm from "./trading/TradingForm";
import TradingHoldings from "./trading/TradingHoldings";
import TradeHistory from "./trading/TradeHistory";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import type { Trade, CoinOption } from "@/types/trading";
import { updateWithAUDPrices } from "@/services/currencyApi";

const initialCoins: CoinOption[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
];

const FakeTrading = () => {
  const [trades, setTrades] = useLocalStorage<Trade[]>("fakeTradingHistory", []);
  const [balance, setBalance] = useLocalStorage<number>("fakeTradingBalance", 10000);
  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>(initialCoins);
  
  const {
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    convert,
    formatValue,
    convertAndFormat
  } = useCurrencyConverter();
  
  // Update coins with AUD prices when currency rates change
  useEffect(() => {
    if (conversionRates.USD_AUD > 0) {
      setAvailableCoins(updateWithAUDPrices(initialCoins, conversionRates.USD_AUD));
    }
  }, [conversionRates]);

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
        // Use the appropriate price based on currency
        const price = activeCurrency === 'AUD' && coin.priceAUD 
          ? coin.priceAUD 
          : coin.price;
          
        totalValue += price * coinHoldings[coinId];
      }
    });
    
    return totalValue;
  };

  const calculatePerformance = (): number => {
    const initialBalance = 10000;
    const currentValue = calculatePortfolioValue();
    return ((currentValue - initialBalance) / initialBalance) * 100;
  };

  const handleExecuteTrade = (type: 'buy' | 'sell', coinId: string, amount: number) => {
    const coinData = availableCoins.find(c => c.id === coinId);
    if (!coinData) return;

    // Use the appropriate price based on currency
    const price = activeCurrency === 'AUD' && coinData.priceAUD 
      ? coinData.priceAUD 
      : coinData.price;
      
    const totalValue = amount * price;

    const newTrade: Trade = {
      id: Date.now().toString(),
      coinId: coinData.id,
      coinName: coinData.name,
      coinSymbol: coinData.symbol,
      type,
      amount,
      price,
      totalValue,
      timestamp: new Date().toISOString(),
      currency: activeCurrency, // Add currency to the trade
    };

    setTrades([newTrade, ...trades]);

    if (type === 'buy') {
      setBalance(balance - totalValue);
    } else {
      setBalance(balance + totalValue);
    }

    toast({
      title: "Trade Executed",
      description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${coinData.symbol}`,
    });
  };

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
            <div className="text-2xl font-bold">{formatValue(balance)}</div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold">{formatValue(calculatePortfolioValue())}</div>
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
          <TradingForm
            balance={balance}
            availableCoins={availableCoins}
            onExecuteTrade={handleExecuteTrade}
            getOwnedCoinAmount={getOwnedCoinAmount}
            activeCurrency={activeCurrency}
            onCurrencyChange={setActiveCurrency}
            conversionRate={conversionRates.USD_AUD}
          />
          
          <TradingHoldings
            availableCoins={availableCoins}
            getOwnedCoinAmount={getOwnedCoinAmount}
            onReset={resetTradingSystem}
            formatCurrency={formatValue}
            activeCurrency={activeCurrency}
            conversionRate={conversionRates.USD_AUD}
          />
        </div>
        
        <div className="mt-6">
          <TradeHistory
            trades={trades}
            formatCurrency={formatValue}
            activeCurrency={activeCurrency}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FakeTrading;
