import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { updateWithCurrencyRates } from "@/services/currencyApi";
import { toast } from "@/components/ui/use-toast";
import type { Trade, CoinOption } from "@/types/trading";
import { useState, useEffect } from "react";
import { startPriceMonitoring } from "@/services/priceMonitoring";

const initialCoins: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 61245.32, 
    marketCap: 1180000000000, 
    volume: 28000000000,
    current_price: 61245.32,
    market_cap: 1180000000000,
    market_cap_rank: 1
  },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45, marketCap: 360000000000, volume: 15000000000 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, marketCap: 62000000000, volume: 3800000000 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, marketCap: 16000000000, volume: 420000000 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57, marketCap: 31000000000, volume: 1800000000 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14, marketCap: 19000000000, volume: 980000000 },
];

export const useTradingPortfolio = () => {
  const [trades, setTrades] = useLocalStorage<Trade[]>("fakeTradingHistory", []);
  const [balance, setBalance] = useLocalStorage<number>("fakeTradingBalance", 10000);
  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>(initialCoins);
  
  const {
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    formatValue,
  } = useCurrencyConverter();

  useEffect(() => {
    const stopMonitoring = startPriceMonitoring(
      initialCoins.map(coin => coin.id),
      (updatedPrices) => {
        if (conversionRates.USD_AUD > 0) {
          setAvailableCoins(updateWithCurrencyRates(updatedPrices, {
            USD_AUD: conversionRates.USD_AUD,
            AUD_USD: conversionRates.AUD_USD,
            USD_EUR: conversionRates.USD_EUR,
            EUR_USD: conversionRates.EUR_USD,
            USD_GBP: conversionRates.USD_GBP,
            GBP_USD: conversionRates.GBP_USD,
            lastUpdated: conversionRates.lastUpdated
          }));
        } else {
          setAvailableCoins(updatedPrices);
        }
      },
      30000 // Update every 30 seconds
    );

    return () => stopMonitoring();
  }, [conversionRates.USD_AUD]);

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
    
    Object.keys(coinHoldings).forEach(coinId => {
      const coin = availableCoins.find(c => c.id === coinId);
      if (coin && coinHoldings[coinId] > 0) {
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
      currency: activeCurrency,
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

  return {
    trades,
    balance,
    availableCoins,
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    formatValue,
    getOwnedCoinAmount,
    calculatePortfolioValue,
    calculatePerformance,
    handleExecuteTrade,
    resetTradingSystem
  };
};
