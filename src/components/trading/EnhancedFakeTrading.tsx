
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingForm from "./TradingForm";
import TradingHoldings from "./TradingHoldings";
import TradeHistory from "./TradeHistory";
import TradingStats, { SupportedCurrency } from "./TradingStats";
import AccountManager from "./AccountManager";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from "@/types/trading";
import { Activity, LineChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import RealTimePriceChart from "./RealTimePriceChart";

const EnhancedFakeTrading: React.FC = () => {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    createAccount,
    deleteAccount,
    addTradeToAccount,
    getActiveAccount
  } = useTradingAccounts();

  const activeAccount = getActiveAccount();

  const {
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    formatValue,
  } = useCurrencyConverter();

  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>([
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
  ]);
  
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [activeTab, setActiveTab] = useState<string>("trading");

  // Set up real-time price updates
  useEffect(() => {
    const coinIds = availableCoins.map(coin => coin.id);
    
    const stopMonitoring = startPriceMonitoring(
      coinIds,
      (updatedCoins) => {
        setAvailableCoins(prev => {
          return prev.map(coin => {
            const updatedCoin = updatedCoins.find(c => c.id === coin.id);
            if (!updatedCoin) return coin;
            
            return {
              ...coin,
              price: updatedCoin.price,
              priceChange: updatedCoin.priceChange,
              changePercent: updatedCoin.changePercent,
            };
          });
        });
      },
      5000 // Update every 5 seconds
    );
    
    toast({
      title: "Real-Time Trading Activated",
      description: "Prices will update every 5 seconds"
    });
    
    return () => {
      stopMonitoring();
    };
  }, []);

  const getOwnedCoinAmount = (coinId: string) => {
    if (!activeAccount) return 0;
    
    return activeAccount.trades
      .filter(trade => trade.coinId === coinId)
      .reduce((total, trade) => {
        if (trade.type === 'buy') {
          return total + trade.amount;
        } else {
          return total - trade.amount;
        }
      }, 0);
  };

  const calculatePortfolioValue = () => {
    if (!activeAccount) return 0;
    
    let totalValue = activeAccount.balance;
    const coinHoldings: { [key: string]: number } = {};
    
    activeAccount.trades.forEach(trade => {
      if (!coinHoldings[trade.coinId]) {
        coinHoldings[trade.coinId] = 0;
      }
      
      if (trade.type === 'buy') {
        coinHoldings[trade.coinId] += trade.amount;
      } else {
        coinHoldings[trade.coinId] -= trade.amount;
      }
    });
    
    Object.entries(coinHoldings).forEach(([coinId, amount]) => {
      if (amount > 0) {
        const coin = availableCoins.find(c => c.id === coinId);
        if (coin) {
          totalValue += coin.price * amount;
        }
      }
    });
    
    return totalValue;
  };

  const calculatePerformance = () => {
    if (!activeAccount) return 0;
    return ((calculatePortfolioValue() - activeAccount.initialBalance) / activeAccount.initialBalance) * 100;
  };

  const handleExecuteTrade = (type: 'buy' | 'sell', coinId: string, amount: number) => {
    if (!activeAccount) return;
    
    const selectedCurrency = activeCurrency as SupportedCurrency;
    const selectedCoin = availableCoins.find(c => c.id === coinId);
    
    if (!selectedCoin) return;
    
    const trade = {
      id: Date.now().toString(),
      coinId,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type,
      amount,
      price: selectedCoin.price,
      totalValue: amount * selectedCoin.price,
      timestamp: new Date().toISOString(),
      currency: selectedCurrency
    };
    
    addTradeToAccount(activeAccount.id, trade);
    
    toast({
      title: `${type === 'buy' ? 'Buy' : 'Sell'} Order Executed`,
      description: `${amount} ${selectedCoin.symbol} at ${formatValue(selectedCoin.price)}`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Enhanced Trading System
        </CardTitle>
        <CardDescription>Practice trading with real-time price updates</CardDescription>
      </CardHeader>
      
      <CardContent>
        <AccountManager 
          accounts={accounts}
          activeAccountId={activeAccountId}
          onSelectAccount={setActiveAccountId}
          onCreateAccount={createAccount}
          onDeleteAccount={deleteAccount}
        />
        
        {activeAccount && (
          <>
            <TradingStats
              balance={activeAccount.balance}
              portfolioValue={calculatePortfolioValue()}
              performance={calculatePerformance()}
              formatValue={formatValue}
              currency={activeCurrency as SupportedCurrency}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="chart">Price Chart</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trading" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TradingForm
                    balance={activeAccount.balance}
                    availableCoins={availableCoins}
                    onExecuteTrade={handleExecuteTrade}
                    getOwnedCoinAmount={getOwnedCoinAmount}
                    activeCurrency={activeCurrency as SupportedCurrency}
                    onCurrencyChange={setActiveCurrency as (currency: SupportedCurrency) => void}
                    conversionRate={conversionRates.USD_AUD}
                  />
                  
                  <TradingHoldings
                    availableCoins={availableCoins}
                    getOwnedCoinAmount={getOwnedCoinAmount}
                    onReset={() => deleteAccount(activeAccount.id)}
                    formatCurrency={formatValue}
                    activeCurrency={activeCurrency as SupportedCurrency}
                    conversionRate={conversionRates.USD_AUD}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="chart">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Real-Time Price Chart
                      </CardTitle>
                      <div>
                        <select
                          className="text-sm border rounded px-2 py-1"
                          value={selectedCoin}
                          onChange={(e) => setSelectedCoin(e.target.value)}
                        >
                          {availableCoins.map((coin) => (
                            <option key={coin.id} value={coin.id}>
                              {coin.name} ({coin.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RealTimePriceChart
                      coinId={selectedCoin}
                      availableCoins={availableCoins}
                      updateInterval={5000}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <TradeHistory
                  trades={activeAccount.trades}
                  formatCurrency={formatValue}
                  activeCurrency={activeCurrency as SupportedCurrency}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedFakeTrading;
