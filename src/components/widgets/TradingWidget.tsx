
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
  const isPositive = performance >= 0;

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className={`pb-2 ${isCompact ? 'pb-1' : ''}`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Quick Trading</CardTitle>
          <CurrencySelector activeCurrency={activeCurrency} onCurrencyChange={setActiveCurrency} />
        </div>
      </CardHeader>
      
      <CardContent className={isCompact ? 'pt-2' : ''}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-2xl font-bold">{formatValue(portfolioValue)}</div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Performance</div>
              <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <span className="text-lg font-medium">{isPositive ? '+' : ''}{performance.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Available Balance</div>
              <div className="font-medium">{formatValue(balance)}</div>
            </div>
          </div>
        </div>
        
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
