
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Wallet, BarChart4, Coins } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CoinOption } from "@/types/trading";
import PortfolioHistoryChart from "./PortfolioHistoryChart";

type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

interface TradingHoldingsProps {
  availableCoins: CoinOption[];
  getOwnedCoinAmount: (coinId: string) => number;
  onReset: () => void;
  formatCurrency: (value: number) => string;
  activeCurrency: SupportedCurrency;
  conversionRate: number;
}

// Generate mock history data for demo purposes
const generateMockHistoryData = () => {
  const baseDate = new Date();
  const data = [];
  let invested = 10000;
  let value = 10000;
  
  // Generate last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Random daily change between -3% and +4%
    const dailyChange = (Math.random() * 7) - 3;
    value = value * (1 + (dailyChange / 100));
    
    // Occasional investments
    if (i % 5 === 0 && i > 0) {
      const investment = Math.floor(Math.random() * 500) + 200;
      invested += investment;
      value += investment;
    }
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value * 100) / 100,
      invested: Math.round(invested * 100) / 100
    });
  }
  
  return data;
};

const TradingHoldings = ({ 
  availableCoins, 
  getOwnedCoinAmount, 
  onReset, 
  formatCurrency,
  activeCurrency,
  conversionRate 
}: TradingHoldingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("holdings");
  
  const hasHoldings = availableCoins.some(coin => getOwnedCoinAmount(coin.id) > 0);

  // Generate mock portfolio history data
  const portfolioHistoryData = generateMockHistoryData();

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Your Portfolio</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings" className="gap-2">
            <Coins className="h-4 w-4" />
            <span>Holdings</span>
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Chart</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="holdings">
          <div className="space-y-2">
            {availableCoins.map(coin => {
              const ownedAmount = getOwnedCoinAmount(coin.id);
              if (ownedAmount <= 0) return null;
              
              // Use the appropriate price based on currency
              const price = activeCurrency === 'AUD' && coin.priceAUD 
                ? coin.priceAUD 
                : activeCurrency === 'AUD' 
                  ? coin.price * conversionRate 
                  : coin.price;
                  
              const value = ownedAmount * price;
              
              // Calculate profit/loss (simplified for this component)
              const profitLoss = 0; // This would be calculated based on purchase history
              const profitLossPercentage = 0; // This would be calculated based on purchase history
              
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
            
            {!hasHoldings && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any holdings yet.</p>
                <p className="text-sm">Start buying some crypto to build your portfolio.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="chart">
          {hasHoldings ? (
            <PortfolioHistoryChart 
              currency={activeCurrency} 
              isCompact 
              data={portfolioHistoryData} 
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No portfolio history to display.</p>
              <p className="text-sm">Start trading to see your performance charts.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingHoldings;
