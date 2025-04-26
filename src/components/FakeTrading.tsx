
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TradingForm from "./trading/TradingForm";
import TradingHoldings from "./trading/TradingHoldings";
import TradeHistory from "./trading/TradeHistory";
import TradingStats from "./trading/TradingStats";
import { useTradingPortfolio } from "@/hooks/use-trading-portfolio";

const FakeTrading = () => {
  const {
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
  } = useTradingPortfolio();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fake Trading System</CardTitle>
        <CardDescription>Practice trading without real money</CardDescription>
      </CardHeader>
      
      <CardContent>
        <TradingStats
          balance={balance}
          portfolioValue={calculatePortfolioValue()}
          performance={calculatePerformance()}
          formatValue={formatValue}
        />
        
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
