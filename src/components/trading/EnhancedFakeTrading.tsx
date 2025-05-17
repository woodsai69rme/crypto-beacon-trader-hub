
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, BarChart } from "lucide-react";
import FakeTradingForm from './FakeTradingForm';
import { Trade, CoinOption } from '@/types/trading';
import { fetchTopCryptoData } from '@/services/cryptoService';
import LoadingSpinner from './LoadingSpinner';

const EnhancedFakeTrading: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trading");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>([]);
  
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setIsLoading(true);
        const coins = await fetchTopCryptoData(10);
        setAvailableCoins(coins.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.price || 0,
          priceChange: coin.priceChange || 0,
          changePercent: coin.changePercent || 0,
          value: coin.id,
          label: `${coin.name} (${coin.symbol})`
        })));
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCoins();
  }, []);
  
  const handleTrade = (trade: Trade) => {
    setTrades(prevTrades => [...prevTrades, trade]);
  };
  
  const calculateProfitLoss = () => {
    return trades.reduce((total, trade) => {
      const tradeValue = trade.type === 'buy' 
        ? -1 * trade.totalValue 
        : trade.totalValue;
      return total + tradeValue;
    }, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Paper Trading
        </CardTitle>
        <CardDescription>Practice trading without risking real money</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trading">
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <FakeTradingForm 
                onTrade={handleTrade} 
                availableCoins={availableCoins}
                advancedMode={advancedMode}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Trades</h3>
                <div className="text-sm">
                  <span className="font-medium">P&L: </span>
                  <span className={calculateProfitLoss() >= 0 ? "text-green-500" : "text-red-500"}>
                    {calculateProfitLoss() >= 0 ? '+' : ''}
                    ${calculateProfitLoss().toFixed(2)}
                  </span>
                </div>
              </div>
              
              {trades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No trades yet. Start trading to see your history.
                </div>
              ) : (
                <div className="space-y-2">
                  {trades.map((trade, index) => (
                    <div 
                      key={trade.id || index}
                      className={`flex items-center justify-between p-3 border rounded ${
                        trade.type === 'buy' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {trade.type === 'buy' ? (
                          <ArrowUpCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">
                            {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.coinName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(trade.timestamp || Date.now()).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${trade.totalValue.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Price: ${trade.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedFakeTrading;
