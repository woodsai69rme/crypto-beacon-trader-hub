
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRightLeft, TrendingDown } from "lucide-react";
import { Trade } from "@/types/trading";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { SupportedCurrency } from "@/components/trading/TradingStats";

interface TaxHarvestingOpportunity {
  coinId: string;
  coinSymbol: string;
  currentPrice: number;
  averageCost: number;
  quantity: number;
  potentialLoss: number;
  recommendedAction: 'sell' | 'hold';
  reasoning: string;
  washSaleWarning: boolean;
}

const TaxHarvestingTool = () => {
  const { toast } = useToast();
  const { accounts, activeAccountId, addTradeToAccount, getActiveAccount } = useTradingAccounts();
  
  const [taxYear, setTaxYear] = useState<number>(new Date().getFullYear());
  const [minLossThreshold, setMinLossThreshold] = useState<number>(100);
  const [washSalePeriod, setWashSalePeriod] = useState<number>(30);
  const [includeFees, setIncludeFees] = useState<boolean>(true);
  const [opportunities, setOpportunities] = useState<TaxHarvestingOpportunity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];
  
  const activeAccount = getActiveAccount();
  
  const analyzeTaxOpportunities = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // In a real app, this would analyze actual trade data
      // For this demo, we'll generate some sample opportunities
      const mockOpportunities: TaxHarvestingOpportunity[] = [
        {
          coinId: "bitcoin",
          coinSymbol: "BTC",
          currentPrice: 57250.75,
          averageCost: 62500.25,
          quantity: 0.25,
          potentialLoss: 1312.38,
          recommendedAction: 'sell',
          reasoning: "Harvesting this loss could offset capital gains while still maintaining crypto exposure through alternative assets",
          washSaleWarning: false
        },
        {
          coinId: "solana",
          coinSymbol: "SOL",
          currentPrice: 112.50,
          averageCost: 148.75,
          quantity: 10,
          potentialLoss: 362.50,
          recommendedAction: 'sell',
          reasoning: "Opportunity to realize loss and potentially re-enter at better price point after wash sale period",
          washSaleWarning: true
        },
        {
          coinId: "cardano",
          coinSymbol: "ADA",
          currentPrice: 0.38,
          averageCost: 0.42,
          quantity: 1000,
          potentialLoss: 40.00,
          recommendedAction: 'hold',
          reasoning: "Loss is below your minimum threshold of $100",
          washSaleWarning: false
        }
      ];
      
      setOpportunities(mockOpportunities.filter(o => o.potentialLoss > minLossThreshold));
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockOpportunities.length} potential tax harvesting opportunities`,
      });
    }, 1500);
  };
  
  const executeHarvesting = (opportunity: TaxHarvestingOpportunity) => {
    if (!activeAccount) return;
    
    // Create a sell trade to harvest the tax loss
    const trade: Omit<Trade, "id" | "timestamp"> = {
      coinId: opportunity.coinId,
      coinName: `${opportunity.coinSymbol} Coin`,
      coinSymbol: opportunity.coinSymbol,
      type: 'sell',
      amount: opportunity.quantity,
      price: opportunity.currentPrice,
      totalValue: opportunity.quantity * opportunity.currentPrice,
      currency: "USD" as SupportedCurrency,
      tags: ['tax-harvesting']
    };
    
    addTradeToAccount(activeAccount.id, trade as Trade);
    
    // Remove this opportunity from the list
    setOpportunities(opportunities.filter(o => o.coinId !== opportunity.coinId));
    
    toast({
      title: "Tax Loss Harvested",
      description: `Successfully sold ${opportunity.quantity} ${opportunity.coinSymbol} to harvest a $${opportunity.potentialLoss.toFixed(2)} loss`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Tax Loss Harvesting Tool
        </CardTitle>
        <CardDescription>
          Identify opportunities to offset capital gains by harvesting losses in your portfolio
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tax-year">Tax Year</Label>
              <Select value={taxYear.toString()} onValueChange={(value) => setTaxYear(parseInt(value))}>
                <SelectTrigger id="tax-year" className="w-full mt-1">
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="loss-threshold">Min Loss Threshold ($)</Label>
              <Input 
                id="loss-threshold"
                type="number"
                value={minLossThreshold}
                onChange={(e) => setMinLossThreshold(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="wash-sale-period">Wash Sale Period (days)</Label>
              <Input 
                id="wash-sale-period"
                type="number"
                value={washSalePeriod}
                onChange={(e) => setWashSalePeriod(parseInt(e.target.value) || 30)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-end">
              <div className="items-top flex space-x-2 mt-6">
                <Checkbox 
                  id="include-fees" 
                  checked={includeFees}
                  onCheckedChange={(checked) => setIncludeFees(!!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="include-fees">Include fees in calculations</Label>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={analyzeTaxOpportunities} 
            disabled={isAnalyzing}
            className="w-full md:w-auto"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Tax Opportunities"}
          </Button>
          
          {opportunities.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Tax Harvesting Opportunities</h3>
              
              <div className="space-y-4">
                {opportunities.map((opportunity, index) => (
                  <div key={index} className="border rounded-md p-4 bg-muted/40">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{opportunity.coinSymbol}</div>
                      <div className={opportunity.recommendedAction === 'sell' ? 'text-green-600' : 'text-amber-600'}>
                        {opportunity.recommendedAction === 'sell' ? 'Recommended' : 'Hold'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                      <div className="text-muted-foreground">Quantity:</div>
                      <div>{opportunity.quantity}</div>
                      
                      <div className="text-muted-foreground">Current Price:</div>
                      <div>${opportunity.currentPrice.toFixed(2)}</div>
                      
                      <div className="text-muted-foreground">Average Cost:</div>
                      <div>${opportunity.averageCost.toFixed(2)}</div>
                      
                      <div className="text-muted-foreground">Potential Loss:</div>
                      <div className="text-red-500">-${opportunity.potentialLoss.toFixed(2)}</div>
                    </div>
                    
                    <div className="mt-3 text-sm">{opportunity.reasoning}</div>
                    
                    {opportunity.washSaleWarning && (
                      <div className="mt-2 text-sm bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 p-2 rounded">
                        Wash Sale Warning: Don't repurchase this asset within {washSalePeriod} days to avoid wash sale rules.
                      </div>
                    )}
                    
                    {opportunity.recommendedAction === 'sell' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-3 w-full sm:w-auto"
                        onClick={() => executeHarvesting(opportunity)}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Execute Tax Harvest
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxHarvestingTool;
