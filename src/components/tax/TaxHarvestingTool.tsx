
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { TaxHarvestingOptions, TaxHarvestingOpportunity, Trade } from "@/types/trading";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { Tax, RefreshCw, ArrowDownUp, FileSpreadsheet } from "lucide-react";

const DEFAULT_OPTIONS: TaxHarvestingOptions = {
  year: new Date().getFullYear(),
  minLossThreshold: 100,
  washSalePeriod: 30,
  includeFees: true,
  maximizeLoss: true
};

const TaxHarvestingTool: React.FC = () => {
  const { accounts, activeAccountId, executeAccountTrade } = useTradingAccounts();
  const { formatValue } = useCurrencyConverter();
  
  const [options, setOptions] = useState<TaxHarvestingOptions>(DEFAULT_OPTIONS);
  const [opportunities, setOpportunities] = useState<TaxHarvestingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPotentialLoss, setTotalPotentialLoss] = useState<number>(0);
  
  const activeAccount = accounts.find(account => account.id === activeAccountId);
  
  // Mock data for demo purposes - in a real app, this would come from API/calculations
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - i
  );
  
  const findHarvestingOpportunities = () => {
    if (!activeAccount) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // This is a simplified mock calculation - in a real app, this would be more complex
      // and would consider actual cost basis, wash sale rules, etc.
      const holdings: Record<string, { 
        amount: number, 
        avgCost: number, 
        trades: Trade[]
      }> = {};
      
      // Calculate holdings and average cost
      activeAccount.trades.forEach(trade => {
        if (!holdings[trade.coinId]) {
          holdings[trade.coinId] = { 
            amount: 0, 
            avgCost: 0,
            trades: []
          };
        }
        
        const holding = holdings[trade.coinId];
        
        if (trade.type === 'buy') {
          const newAmount = holding.amount + trade.amount;
          // Weighted average cost
          holding.avgCost = (holding.amount * holding.avgCost + trade.totalValue) / newAmount;
          holding.amount = newAmount;
        } else {
          holding.amount -= trade.amount;
        }
        
        holding.trades.push(trade);
      });
      
      // Mock current prices - in a real app, we'd fetch these from an API
      const currentPrices: Record<string, number> = {
        bitcoin: 50000,
        ethereum: 2500,
        solana: 100,
        cardano: 0.35,
        ripple: 0.50,
        dogecoin: 0.10
      };
      
      // Find opportunities where current price < average cost
      const harvestOpportunities: TaxHarvestingOpportunity[] = [];
      
      Object.entries(holdings).forEach(([coinId, holding]) => {
        if (holding.amount <= 0) return; // Skip coins we don't own
        
        const currentPrice = currentPrices[coinId] || 0;
        if (currentPrice === 0) return; // Skip if we don't have a price
        
        const unrealizedLoss = (currentPrice - holding.avgCost) * holding.amount;
        
        if (unrealizedLoss < -options.minLossThreshold) {
          // Check if there's a wash sale risk
          const lastBuy = holding.trades
            .filter(t => t.type === 'buy')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          
          const washSaleWarning = lastBuy && 
            (Date.now() - new Date(lastBuy.timestamp).getTime()) < (options.washSalePeriod * 24 * 60 * 60 * 1000);
          
          harvestOpportunities.push({
            coinId,
            coinSymbol: holding.trades[0].coinSymbol,
            currentPrice,
            averageCost: holding.avgCost,
            quantity: holding.amount,
            potentialLoss: Math.abs(unrealizedLoss),
            recommendedAction: washSaleWarning ? 'hold' : 'sell',
            reasoning: washSaleWarning 
              ? "Recent purchase may trigger wash sale rule"
              : "Selling would lock in loss and reduce tax liability",
            washSaleWarning
          });
        }
      });
      
      // Sort by potential loss (highest first)
      harvestOpportunities.sort((a, b) => b.potentialLoss - a.potentialLoss);
      
      setOpportunities(harvestOpportunities);
      setTotalPotentialLoss(harvestOpportunities.reduce((sum, opp) => sum + opp.potentialLoss, 0));
      setIsLoading(false);
      
      toast({
        title: "Tax Harvesting Analysis Complete",
        description: `Found ${harvestOpportunities.length} potential opportunities`,
      });
    }, 1500);
  };
  
  const handleExecuteSell = (opportunity: TaxHarvestingOpportunity) => {
    if (!activeAccount) return;
    
    const trade = {
      coinId: opportunity.coinId,
      coinName: opportunity.coinSymbol,
      coinSymbol: opportunity.coinSymbol,
      type: 'sell' as const,
      amount: opportunity.quantity,
      price: opportunity.currentPrice,
      totalValue: opportunity.quantity * opportunity.currentPrice,
      currency: activeAccount.currency,
      tags: ['tax-loss-harvesting']
    };
    
    executeAccountTrade(activeAccount.id, trade);
    
    // Remove this opportunity from the list
    setOpportunities(opportunities.filter(o => o.coinId !== opportunity.coinId));
    
    toast({
      title: "Tax Loss Harvesting Trade Executed",
      description: `Sold ${opportunity.quantity} ${opportunity.coinSymbol} to realize tax loss`,
    });
  };
  
  const handleExportReport = () => {
    // Create CSV data
    const headers = [
      'Coin', 'Quantity', 'Current Price', 'Average Cost', 
      'Potential Loss', 'Recommendation', 'Reasoning', 'Wash Sale Warning'
    ];
    
    const rows = opportunities.map(opp => [
      opp.coinSymbol,
      opp.quantity.toString(),
      opp.currentPrice.toString(),
      opp.averageCost.toString(),
      opp.potentialLoss.toFixed(2),
      opp.recommendedAction,
      opp.reasoning,
      opp.washSaleWarning ? 'Yes' : 'No'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tax-harvesting-report-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Exported",
      description: "Tax harvesting report has been downloaded as a CSV file",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tax className="h-5 w-5" />
          Tax Loss Harvesting Tool
        </CardTitle>
        <CardDescription>
          Find opportunities to harvest losses and reduce your tax liability
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="opportunities">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="opportunities">
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-2">Potential Tax Loss</div>
                  <div className="text-2xl font-bold">{formatValue(totalPotentialLoss)}</div>
                </div>
                <div className="bg-muted/40 p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-2">Opportunities</div>
                  <div className="text-2xl font-bold">{opportunities.length}</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={findHarvestingOpportunities}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><RefreshCw className="mr-2 h-4 w-4" /> Analyze Portfolio</>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleExportReport}
                  disabled={opportunities.length === 0}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Report
                </Button>
              </div>
            </div>
            
            {opportunities.length > 0 ? (
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div 
                    key={opportunity.coinId}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {opportunity.coinSymbol}
                      </div>
                      <div className="text-destructive font-medium">
                        -{formatValue(opportunity.potentialLoss)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Quantity</div>
                        <div>{opportunity.quantity.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current Price</div>
                        <div>{formatValue(opportunity.currentPrice)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Average Cost</div>
                        <div>{formatValue(opportunity.averageCost)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Unrealized Loss</div>
                        <div className="text-destructive">
                          -{formatValue(opportunity.potentialLoss)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex-1">
                        <div className="text-muted-foreground">Recommendation</div>
                        <div className={opportunity.recommendedAction === 'sell' 
                          ? "text-green-600" 
                          : "text-amber-500"
                        }>
                          {opportunity.recommendedAction === 'sell' ? 'Sell to harvest loss' : 'Hold (wash sale risk)'}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={opportunity.recommendedAction === 'hold'}
                        onClick={() => handleExecuteSell(opportunity)}
                      >
                        Sell Now
                      </Button>
                    </div>
                    
                    {opportunity.washSaleWarning && (
                      <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm p-2 rounded">
                        Warning: Recent purchase detected. Selling now may trigger wash sale rules and disallow this loss.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {isLoading ? (
                  <div>Analyzing your portfolio for tax loss harvesting opportunities...</div>
                ) : (
                  <div>
                    <div className="mb-2">No harvesting opportunities found</div>
                    <div className="text-sm">Click "Analyze Portfolio" to scan for potential tax losses</div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tax Year</Label>
                    <Select
                      value={options.year.toString()}
                      onValueChange={(value) => setOptions({ ...options, year: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Minimum Loss Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={options.minLossThreshold}
                        onChange={(e) => setOptions({ 
                          ...options, 
                          minLossThreshold: parseFloat(e.target.value) || 0 
                        })}
                      />
                      <div className="text-sm text-muted-foreground">USD</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Only show opportunities with potential losses greater than this amount
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wash Sale Period (Days)</Label>
                    <div className="pt-2">
                      <Slider
                        value={[options.washSalePeriod]}
                        min={0}
                        max={60}
                        step={1}
                        onValueChange={(values) => setOptions({ 
                          ...options, 
                          washSalePeriod: values[0] 
                        })}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>0</div>
                        <div>{options.washSalePeriod} days</div>
                        <div>60</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Period to check for potential wash sales (typically 30 days)
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-fees">Include Fees in Calculations</Label>
                      <Switch
                        id="include-fees"
                        checked={options.includeFees}
                        onCheckedChange={(checked) => setOptions({ ...options, includeFees: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maximize-loss">Maximize Loss (Sell Entire Position)</Label>
                      <Switch
                        id="maximize-loss"
                        checked={options.maximizeLoss}
                        onCheckedChange={(checked) => setOptions({ ...options, maximizeLoss: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={findHarvestingOpportunities}>
                  Save & Analyze
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">What is Tax Loss Harvesting?</h3>
                <p className="text-muted-foreground">
                  Tax loss harvesting is the practice of selling cryptocurrency at a loss to offset capital gains tax liability. 
                  This strategy can help reduce your overall tax burden in the current tax year.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">How It Works</h3>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Identify cryptocurrencies in your portfolio that are currently worth less than what you paid for them.</li>
                  <li>Sell these assets to realize the loss, which can then be used to offset capital gains.</li>
                  <li>If desired, you can repurchase similar (but not identical) assets to maintain market exposure.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Wash Sale Rule</h3>
                <p className="text-muted-foreground mb-3">
                  The IRS wash sale rule prevents claiming a loss deduction if you purchase the same or 
                  "substantially identical" security within 30 days before or after the sale.
                </p>
                <div className="bg-muted/50 p-3 rounded-md border">
                  <p className="text-sm">
                    <strong>Note:</strong> While the wash sale rule traditionally applies to securities, 
                    the IRS has not provided definitive guidance on how it applies to cryptocurrencies. 
                    Many tax professionals recommend following the rule as a precaution. Always consult 
                    with a tax professional for your specific situation.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Disclaimer</h3>
                <p className="text-muted-foreground">
                  This tool provides informational guidance only and should not be considered tax advice. 
                  Always consult with a qualified tax professional before implementing tax strategies.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxHarvestingTool;
