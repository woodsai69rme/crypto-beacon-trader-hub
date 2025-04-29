
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, TrendingUp, Calendar, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaxBracket {
  minIncome: number;
  maxIncome: number | null;
  rate: number;
}

const TaxCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("income");
  const [income, setIncome] = useState<number>(100000);
  const [deductions, setDeductions] = useState<number>(10000);
  const [withheld, setWithheld] = useState<number>(22000);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxOwed, setTaxOwed] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [refund, setRefund] = useState<number>(0);
  
  // Crypto specific
  const [cryptoIncome, setCryptoIncome] = useState<number>(50000);
  const [cryptoHoldingPeriod, setCryptoHoldingPeriod] = useState<number>(400);
  const [cryptoTaxRate, setCryptoTaxRate] = useState<number>(0);
  const [applyDiscount, setApplyDiscount] = useState<boolean>(true);
  const [cryptoTaxOwed, setCryptoTaxOwed] = useState<number>(0);
  
  // US tax brackets for 2023 (simplified)
  const taxBrackets: TaxBracket[] = [
    { minIncome: 0, maxIncome: 11000, rate: 0.10 },
    { minIncome: 11000, maxIncome: 44725, rate: 0.12 },
    { minIncome: 44725, maxIncome: 95375, rate: 0.22 },
    { minIncome: 95375, maxIncome: 182100, rate: 0.24 },
    { minIncome: 182100, maxIncome: 231250, rate: 0.32 },
    { minIncome: 231250, maxIncome: 578125, rate: 0.35 },
    { minIncome: 578125, maxIncome: null, rate: 0.37 },
  ];
  
  // Calculate income tax
  useEffect(() => {
    const taxableIncome = Math.max(0, income - deductions);
    let tax = 0;
    let effectiveRate = 0;
    
    for (let i = 0; i < taxBrackets.length; i++) {
      const bracket = taxBrackets[i];
      const nextBracketMin = bracket.maxIncome === null ? Infinity : bracket.maxIncome;
      
      if (taxableIncome > bracket.minIncome) {
        const taxableInThisBracket = Math.min(taxableIncome, nextBracketMin) - bracket.minIncome;
        tax += taxableInThisBracket * bracket.rate;
      }
      
      if (taxableIncome >= nextBracketMin) {
        continue;
      }
      
      break;
    }
    
    effectiveRate = taxableIncome > 0 ? (tax / taxableIncome) * 100 : 0;
    
    setTaxRate(effectiveRate);
    setTaxOwed(tax);
    setNetIncome(taxableIncome - tax);
    setRefund(withheld - tax);
    
  }, [income, deductions, withheld]);
  
  // Calculate crypto tax
  useEffect(() => {
    // Apply capital gains rates (simplified)
    let rate = cryptoHoldingPeriod > 365 ? 0.15 : 0.37; // Long-term vs Short-term
    
    // Apply 50% CGT discount for long-term holdings (simplified)
    const taxableAmount = cryptoHoldingPeriod > 365 && applyDiscount
      ? cryptoIncome * 0.5
      : cryptoIncome;
    
    setCryptoTaxRate(rate * 100);
    setCryptoTaxOwed(taxableAmount * rate);
    
  }, [cryptoIncome, cryptoHoldingPeriod, applyDiscount]);

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Tax Calculator</CardTitle>
            <CardDescription>Calculate your tax obligations for crypto and traditional income</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="income">Income Tax</TabsTrigger>
            <TabsTrigger value="crypto">Crypto Tax</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual-income">Annual Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="annual-income"
                    type="number"
                    className="pl-9"
                    value={income}
                    onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-withheld">Tax Withheld</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="tax-withheld"
                    type="number"
                    className="pl-9"
                    value={withheld}
                    onChange={(e) => setWithheld(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="deductions" className="flex-1">Deductions & Credits</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Include standard deduction, itemized deductions, 
                          and credits like child tax credit, education credits, etc.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="deductions"
                    type="number"
                    className="pl-9"
                    value={deductions}
                    onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-year">Tax Year</Label>
                <Select defaultValue="2023">
                  <SelectTrigger id="tax-year">
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Taxable Income</div>
                  <div className="text-lg font-bold">${(income - deductions).toFixed(2)}</div>
                </div>
                
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Effective Tax Rate</div>
                  <div className="text-lg font-bold">{taxRate.toFixed(2)}%</div>
                  <div className="mt-2">
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full"
                        style={{ width: `${Math.min(100, taxRate * 2.5)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Total Tax</div>
                  <div className="text-lg font-bold">${taxOwed.toFixed(2)}</div>
                </div>
                
                <div className={`bg-muted/20 p-3 rounded-md ${refund >= 0 ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`}>
                  <div className="text-xs text-muted-foreground mb-1">
                    {refund >= 0 ? "Tax Refund" : "Tax Due"}
                  </div>
                  <div className={`text-lg font-bold ${refund >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {refund >= 0 ? `$${refund.toFixed(2)}` : `-$${Math.abs(refund).toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tax Bracket Breakdown
              </h3>
              
              <div className="space-y-2">
                {taxBrackets.map((bracket, index) => {
                  const taxableIncome = income - deductions;
                  const bracketMax = bracket.maxIncome === null ? Infinity : bracket.maxIncome;
                  const isInBracket = taxableIncome > bracket.minIncome;
                  const bracketWidth = Math.min(100, ((bracketMax - bracket.minIncome) / 1000000) * 100);
                  
                  return (
                    <div key={index} className="relative">
                      <div className="text-xs flex justify-between">
                        <span>
                          {bracket.minIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          {" - "}
                          {bracket.maxIncome === null ? "∞" : bracket.maxIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                        <span>{(bracket.rate * 100).toFixed(1)}%</span>
                      </div>
                      
                      <div 
                        className={`h-2 rounded-full ${
                          isInBracket ? "bg-primary/70" : "bg-muted/30"
                        }`}
                        style={{ width: `${bracketWidth}%` }}
                      ></div>
                      
                      {taxableIncome > bracket.minIncome && taxableIncome < bracketMax && (
                        <div 
                          className="absolute top-0 h-2 w-1 bg-secondary"
                          style={{ left: `${((taxableIncome - bracket.minIncome) / (bracketMax - bracket.minIncome)) * bracketWidth}%` }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crypto-gains">Crypto Capital Gains</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="crypto-gains"
                    type="number"
                    className="pl-9"
                    value={cryptoIncome}
                    onChange={(e) => setCryptoIncome(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="holding-period">Holding Period ({cryptoHoldingPeriod} days)</Label>
                  <span className="text-xs text-muted-foreground">
                    {cryptoHoldingPeriod > 365 ? "Long Term" : "Short Term"}
                  </span>
                </div>
                <Slider
                  id="holding-period"
                  min={1}
                  max={730}
                  step={1}
                  value={[cryptoHoldingPeriod]}
                  onValueChange={(value) => setCryptoHoldingPeriod(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <div>1 day</div>
                  <div>365 days</div>
                  <div>730 days</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Tax Jurisdiction</Label>
                <Select defaultValue="us">
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 flex flex-col">
                <Label className="mb-2">CGT Discount</Label>
                <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md h-full">
                  <div className="flex-1">
                    <div className="text-sm">Apply 50% CGT discount</div>
                    <div className="text-xs text-muted-foreground">(for holdings {`>`} 1 year)</div>
                  </div>
                  <Switch 
                    checked={applyDiscount} 
                    onCheckedChange={setApplyDiscount}
                    disabled={cryptoHoldingPeriod <= 365} 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-md gap-2">
              <Calendar className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-sm text-amber-500 font-medium">Tax Deadline</div>
                <div className="text-xs">April 15, 2024 for the 2023 tax year</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="text-sm font-medium mb-3">Effective Tax Rate</div>
                <div className="text-2xl font-bold">{cryptoTaxRate.toFixed(1)}%</div>
                <div className="mt-2">
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/70 rounded-full"
                      style={{ width: `${Math.min(100, cryptoTaxRate * 2.5)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {cryptoHoldingPeriod > 365
                    ? "Long-term capital gains rate applied"
                    : "Short-term capital gains rate applied"}
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="text-sm font-medium mb-3">Tax Amount Due</div>
                <div className="text-2xl font-bold">${cryptoTaxOwed.toFixed(2)}</div>
                {cryptoHoldingPeriod > 365 && applyDiscount && (
                  <div className="text-xs text-green-500 mt-2 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    50% CGT discount applied
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  {cryptoHoldingPeriod > 365 && applyDiscount
                    ? `Based on taxable amount of $${(cryptoIncome * 0.5).toFixed(2)}`
                    : `Based on full gain amount of $${cryptoIncome.toFixed(2)}`}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3">Tax Optimization Tips</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 shrink-0">1</div>
                  <div>Hold assets for more than one year to qualify for long-term capital gains rates, which are typically lower than short-term rates.</div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 shrink-0">2</div>
                  <div>Consider tax-loss harvesting by selling assets at a loss to offset capital gains, potentially reducing your overall tax burden.</div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 shrink-0">3</div>
                  <div>Keep detailed records of all cryptocurrency transactions, including dates, amounts, and values in fiat currency at time of transaction.</div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 shrink-0">4</div>
                  <div>Be aware of the tax implications of staking rewards, airdrops, and mining income, which are typically taxed as ordinary income.</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
