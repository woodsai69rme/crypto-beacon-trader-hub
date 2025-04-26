
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useTradingPortfolio } from "@/hooks/use-trading-portfolio";
import TradingForm from "@/components/trading/TradingForm";
import CurrencySelector from "@/components/trading/CurrencySelector";

interface TradingWidgetProps {
  isCompact?: boolean;
}

const TradingWidget = ({ isCompact = false }: TradingWidgetProps) => {
  const {
    balance,
    availableCoins,
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    getOwnedCoinAmount,
    calculatePortfolioValue,
    calculatePerformance,
    formatValue,
    handleExecuteTrade
  } = useTradingPortfolio();

  const portfolioValue = calculatePortfolioValue();
  const performance = calculatePerformance();
  const performanceColor = performance >= 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Quick Trading</CardTitle>
          <CurrencySelector 
            activeCurrency={activeCurrency} 
            onCurrencyChange={setActiveCurrency} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-xl font-semibold">{formatValue(balance)}</div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-xl font-semibold">{formatValue(portfolioValue)}</div>
          </div>
        </div>
        
        {performance !== 0 && (
          <div className="mb-4 p-2 bg-background rounded-lg border flex justify-between items-center">
            <div className="text-sm">Performance</div>
            <div className={`flex items-center ${performanceColor}`}>
              {performance > 0 ? "+" : ""}
              {performance.toFixed(2)}%
              <ArrowUpDown className={`ml-1 h-4 w-4 ${performance >= 0 ? "rotate-0" : "rotate-180"}`} />
            </div>
          </div>
        )}
        
        {!isCompact && (
          <TradingForm
            balance={balance}
            availableCoins={availableCoins}
            onExecuteTrade={handleExecuteTrade}
            getOwnedCoinAmount={getOwnedCoinAmount}
            activeCurrency={activeCurrency}
            onCurrencyChange={setActiveCurrency}
            conversionRate={conversionRates.USD_AUD}
          />
        )}
        
        {isCompact && (
          <Button className="w-full mt-2" variant="outline" onClick={() => window.location.href = "/#trading"}>
            Go to Trading
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingWidget;
