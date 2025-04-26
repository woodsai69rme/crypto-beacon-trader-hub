
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Download, Calculator } from "lucide-react";
import type { Trade } from "@/types/trading";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface TaxCalculatorProps {
  trades: Trade[];
  className?: string;
}

interface TaxSummary {
  totalProfits: number;
  totalLosses: number;
  netGain: number;
  estimatedTax: number;
}

const TaxCalculator = ({ trades, className }: TaxCalculatorProps) => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [taxRate, setTaxRate] = useState("30");
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const { formatValue, activeCurrency } = useCurrencyConverter();
  
  const years = Array.from(
    new Set(trades.map(trade => new Date(trade.timestamp).getFullYear()))
  ).map(year => year.toString());
  
  // Add current year if not already in list
  if (!years.includes(new Date().getFullYear().toString())) {
    years.push(new Date().getFullYear().toString());
  }
  
  // Sort years in descending order
  years.sort((a, b) => parseInt(b) - parseInt(a));
  
  const calculateTaxes = () => {
    // Filter trades for selected year
    const selectedYearStart = new Date(`${year}-01-01T00:00:00`);
    const selectedYearEnd = new Date(`${year}-12-31T23:59:59`);
    
    const yearTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.timestamp);
      return tradeDate >= selectedYearStart && tradeDate <= selectedYearEnd;
    });
    
    let totalProfits = 0;
    let totalLosses = 0;
    
    // Group by coin to calculate profits/losses
    const coinHoldings: { [key: string]: Trade[] } = {};
    
    yearTrades.forEach(trade => {
      if (!coinHoldings[trade.coinId]) {
        coinHoldings[trade.coinId] = [];
      }
      coinHoldings[trade.coinId].push(trade);
    });
    
    // Calculate profits and losses for each coin
    Object.keys(coinHoldings).forEach(coinId => {
      const coinTrades = coinHoldings[coinId];
      const sellTrades = coinTrades.filter(t => t.type === "sell");
      
      sellTrades.forEach(sellTrade => {
        // Find previous buy trades for this coin
        const buyTrades = coinTrades.filter(
          t => t.type === "buy" && new Date(t.timestamp) <= new Date(sellTrade.timestamp)
        );
        
        if (buyTrades.length > 0) {
          // Simple FIFO calculation (First In, First Out)
          const avgBuyPrice = buyTrades.reduce((sum, trade) => sum + trade.price, 0) / buyTrades.length;
          const profitLoss = (sellTrade.price - avgBuyPrice) * sellTrade.amount;
          
          if (profitLoss > 0) {
            totalProfits += profitLoss;
          } else {
            totalLosses += Math.abs(profitLoss);
          }
        }
      });
    });
    
    const netGain = totalProfits - totalLosses;
    const estimatedTax = netGain > 0 ? (netGain * parseFloat(taxRate)) / 100 : 0;
    
    setTaxSummary({
      totalProfits,
      totalLosses,
      netGain,
      estimatedTax
    });
    
    toast({
      title: "Tax Calculation Complete",
      description: `Tax estimate for ${year}: ${formatValue(estimatedTax)}`,
    });
  };
  
  const downloadTaxReport = () => {
    if (!taxSummary) return;
    
    // Create CSV content
    const csvContent = [
      "Tax Report," + year,
      "Currency," + activeCurrency,
      "",
      "Realized Profits," + taxSummary.totalProfits.toFixed(2),
      "Realized Losses," + taxSummary.totalLosses.toFixed(2),
      "Net Gain/Loss," + taxSummary.netGain.toFixed(2),
      "Tax Rate (%)," + taxRate,
      "Estimated Tax," + taxSummary.estimatedTax.toFixed(2),
      "",
      "Transaction Details:",
      "Date,Type,Coin,Amount,Price,Total Value",
      ...trades
        .filter(trade => {
          const tradeYear = new Date(trade.timestamp).getFullYear().toString();
          return tradeYear === year;
        })
        .map(trade => {
          const date = new Date(trade.timestamp).toLocaleDateString();
          return `${date},${trade.type},${trade.coinSymbol},${trade.amount},${trade.price},${trade.totalValue}`;
        })
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `crypto_tax_report_${year}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Tax Report Downloaded",
      description: `Your tax report for ${year} has been downloaded`,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Crypto Tax Calculator
        </CardTitle>
        <CardDescription>
          Estimate your cryptocurrency tax obligations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="tax-year">Tax Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="tax-year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.length > 0 ? (
                  years.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))
                ) : (
                  <SelectItem value={new Date().getFullYear().toString()}>
                    {new Date().getFullYear()}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
            <Input 
              id="tax-rate"
              type="number" 
              min="0" 
              max="100" 
              value={taxRate} 
              onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={calculateTaxes} className="w-full">Calculate</Button>
          </div>
        </div>
        
        {taxSummary && (
          <div className="bg-card border rounded-md p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Realized Profits</div>
                <div className="text-lg font-medium text-green-500">
                  {formatValue(taxSummary.totalProfits)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Realized Losses</div>
                <div className="text-lg font-medium text-red-500">
                  {formatValue(taxSummary.totalLosses)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Net Gain/Loss</div>
                <div className={`text-lg font-medium ${taxSummary.netGain >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatValue(taxSummary.netGain)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Estimated Tax ({taxRate}%)</div>
                <div className="text-lg font-medium">
                  {formatValue(taxSummary.estimatedTax)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={downloadTaxReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Tax Report
              </Button>
            </div>
          </div>
        )}
        
        {!taxSummary && trades.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Click 'Calculate' to estimate your tax obligations for {year}</p>
          </div>
        )}
        
        {trades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No trading history found</p>
            <p className="text-sm">You need to make some trades before you can calculate taxes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
