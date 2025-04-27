
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { Toast } from "@/components/ui/use-toast";
import { Trade, ATOTaxCalculation } from "@/types/trading";
import { FileText, Download, Calculator, Info } from "lucide-react";

interface ATOFormValues {
  financialYear: string;
  additionalIncome: number;
  deductions: number;
  taxWithheld: number;
  useFullCGTDiscount: boolean;
}

const ATOTaxCalculator: React.FC = () => {
  const { accounts, activeAccountId } = useTradingAccounts();
  const activeAccount = accounts.find(acc => acc.id === activeAccountId);
  
  const [formValues, setFormValues] = useState<ATOFormValues>({
    financialYear: "2023-2024",
    additionalIncome: 0,
    deductions: 0,
    taxWithheld: 0,
    useFullCGTDiscount: true,
  });
  
  const [taxResult, setTaxResult] = useState<ATOTaxCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const availableYears = [
    { value: "2023-2024", label: "2023-2024" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2021-2022", label: "2021-2022" },
  ];
  
  // ATO tax rates for 2023-2024
  const taxRates2023: { threshold: number; base: number; rate: number }[] = [
    { threshold: 0, base: 0, rate: 0 },
    { threshold: 18201, base: 0, rate: 0.19 },
    { threshold: 45001, base: 5092, rate: 0.325 },
    { threshold: 120001, base: 29467, rate: 0.37 },
    { threshold: 180001, base: 51667, rate: 0.45 },
  ];

  const calculateTax = () => {
    if (!activeAccount) return;
    
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        // Filter trades for the selected financial year
        const financialYearStart = new Date(parseInt(formValues.financialYear.split('-')[0]), 6, 1); // July 1st
        const financialYearEnd = new Date(parseInt(formValues.financialYear.split('-')[1]), 5, 30); // June 30th
        
        const relevantTrades = activeAccount.trades.filter(trade => {
          const tradeDate = new Date(trade.timestamp);
          return tradeDate >= financialYearStart && tradeDate <= financialYearEnd;
        });
        
        // Calculate capital gains
        let shortTermGains = 0;
        let longTermGains = 0;
        
        // Simple FIFO calculation for demonstration
        // In a real implementation, this would need to handle lot matching methods and proper cost basis
        const buyTrades: { [key: string]: Trade[] } = {};
        
        // Organize buy trades by coin
        relevantTrades.forEach(trade => {
          if (trade.type === 'buy') {
            if (!buyTrades[trade.coinId]) {
              buyTrades[trade.coinId] = [];
            }
            buyTrades[trade.coinId].push(trade);
          }
        });
        
        // Process sell trades
        relevantTrades.forEach(trade => {
          if (trade.type === 'sell') {
            if (buyTrades[trade.coinId] && buyTrades[trade.coinId].length > 0) {
              // Sort buy trades by date (FIFO)
              const sortedBuyTrades = buyTrades[trade.coinId].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
              
              let remainingAmount = trade.amount;
              let costBasis = 0;
              
              while (remainingAmount > 0 && sortedBuyTrades.length > 0) {
                const oldestBuy = sortedBuyTrades[0];
                
                const holdingPeriod = new Date(trade.timestamp).getTime() - new Date(oldestBuy.timestamp).getTime();
                const isLongTerm = holdingPeriod >= 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
                
                if (oldestBuy.amount <= remainingAmount) {
                  // Use the entire buy trade
                  const gain = oldestBuy.amount * trade.price - oldestBuy.totalValue;
                  
                  if (isLongTerm) {
                    longTermGains += gain;
                  } else {
                    shortTermGains += gain;
                  }
                  
                  remainingAmount -= oldestBuy.amount;
                  sortedBuyTrades.shift(); // Remove the used buy trade
                } else {
                  // Use a portion of the buy trade
                  const portion = remainingAmount / oldestBuy.amount;
                  const costBasisPortion = oldestBuy.totalValue * portion;
                  const proceedsPortion = trade.price * remainingAmount;
                  const gain = proceedsPortion - costBasisPortion;
                  
                  if (isLongTerm) {
                    longTermGains += gain;
                  } else {
                    shortTermGains += gain;
                  }
                  
                  // Update the remaining amount in the buy trade
                  oldestBuy.amount -= remainingAmount;
                  oldestBuy.totalValue -= costBasisPortion;
                  remainingAmount = 0;
                }
              }
            }
          }
        });
        
        // Apply 50% CGT discount to long-term gains if eligible
        const cgtDiscount = formValues.useFullCGTDiscount ? longTermGains * 0.5 : 0;
        
        // Calculate total capital gains
        const totalCapitalGains = shortTermGains + longTermGains - cgtDiscount;
        
        // Calculate assessable income
        const assessableIncome = totalCapitalGains + formValues.additionalIncome;
        
        // Calculate taxable income
        const taxableIncome = Math.max(0, assessableIncome - formValues.deductions);
        
        // Calculate tax payable based on ATO tax rates
        let taxPayable = 0;
        for (let i = taxRates2023.length - 1; i >= 0; i--) {
          if (taxableIncome >= taxRates2023[i].threshold) {
            taxPayable = taxRates2023[i].base + 
              (taxableIncome - taxRates2023[i].threshold) * taxRates2023[i].rate;
            break;
          }
        }
        
        // Calculate Medicare levy (2% of taxable income for most taxpayers)
        const medicareLevyPayable = taxableIncome * 0.02;
        
        // Calculate total tax
        const totalTaxPayable = taxPayable + medicareLevyPayable;
        
        // Calculate refund or amount owing
        const taxRefundOrOwed = formValues.taxWithheld - totalTaxPayable;
        
        const result: ATOTaxCalculation = {
          financialYear: formValues.financialYear,
          assessableIncome: assessableIncome,
          capitalGains: totalCapitalGains,
          shortTermGains: shortTermGains,
          longTermGains: longTermGains,
          CGTDiscount: cgtDiscount,
          deductions: formValues.deductions,
          taxableIncome: taxableIncome,
          taxPayable: taxPayable,
          medicareLevyPayable: medicareLevyPayable,
          taxWithheld: formValues.taxWithheld,
          taxRefundOrOwed: taxRefundOrOwed,
          currency: activeAccount.currency,
        };
        
        setTaxResult(result);
        
      } catch (error) {
        console.error("Error calculating ATO tax", error);
      } finally {
        setIsCalculating(false);
      }
    }, 1000); // Simulate calculation time
  };
  
  const handleInputChange = (field: keyof ATOFormValues, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: activeAccount?.currency || 'AUD'
    }).format(value);
  };
  
  const exportTaxReport = () => {
    if (!taxResult) return;
    
    const reportData = {
      taxpayer: {
        name: "Crypto Trader", // In a real app, you'd use the user's name
        account: activeAccount?.name || "Main Account"
      },
      ...taxResult
    };
    
    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ato-tax-report-${taxResult.financialYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ATO Tax Calculator
        </CardTitle>
        <CardDescription>
          Calculate your Australian cryptocurrency tax obligations using ATO guidelines
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="calculator">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="guide">ATO Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Financial Year</Label>
                    <Select
                      value={formValues.financialYear}
                      onValueChange={(value) => handleInputChange('financialYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select financial year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map(year => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Additional Income (AUD)</Label>
                    <Input
                      type="number"
                      value={formValues.additionalIncome}
                      onChange={(e) => handleInputChange('additionalIncome', Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include any other taxable income such as salary, interest, etc.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Deductions (AUD)</Label>
                    <Input
                      type="number"
                      value={formValues.deductions}
                      onChange={(e) => handleInputChange('deductions', Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Total allowable deductions including work-related expenses
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tax Already Withheld (AUD)</Label>
                    <Input
                      type="number"
                      value={formValues.taxWithheld}
                      onChange={(e) => handleInputChange('taxWithheld', Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      PAYG withholding amounts from employment
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="cgtDiscount"
                      checked={formValues.useFullCGTDiscount}
                      onChange={(e) => handleInputChange('useFullCGTDiscount', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="cgtDiscount" className="text-sm font-normal">
                      Apply 50% CGT discount on long-term gains
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info size={16} />
                  Calculator Notes
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>This calculator uses a simple FIFO (First In, First Out) method for calculating capital gains.</li>
                  <li>For accurate tax advice, consult with a qualified tax professional.</li>
                  <li>Long-term gains are assets held for more than 12 months and may be eligible for the 50% CGT discount.</li>
                  <li>This tool does not account for all possible tax situations or offsets.</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={calculateTax} disabled={isCalculating}>
                  {isCalculating ? 'Calculating...' : 'Calculate Tax'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {taxResult ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-muted/40 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Financial Year</div>
                      <div className="text-lg font-semibold">{taxResult.financialYear}</div>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Assessable Income</div>
                      <div className="text-lg font-semibold">{formatCurrency(taxResult.assessableIncome)}</div>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Taxable Income</div>
                      <div className="text-lg font-semibold">{formatCurrency(taxResult.taxableIncome)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/40 p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Total Tax Payable</div>
                      <div className="text-lg font-semibold">
                        {formatCurrency(taxResult.taxPayable + taxResult.medicareLevyPayable)}
                      </div>
                      <div className="mt-2 text-xs flex justify-between text-muted-foreground">
                        <span>Income Tax: {formatCurrency(taxResult.taxPayable)}</span>
                        <span>Medicare Levy: {formatCurrency(taxResult.medicareLevyPayable)}</span>
                      </div>
                    </div>
                    
                    <div className={`bg-muted/40 p-4 rounded-lg border ${
                      taxResult.taxRefundOrOwed >= 0 ? 'border-green-500/50' : 'border-red-500/50'
                    }`}>
                      <div className="text-sm text-muted-foreground mb-1">
                        {taxResult.taxRefundOrOwed >= 0 ? 'Tax Refund' : 'Tax Owed'}
                      </div>
                      <div className={`text-lg font-semibold ${
                        taxResult.taxRefundOrOwed >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(taxResult.taxRefundOrOwed))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Capital Gains Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 border rounded-md">
                      <div className="text-muted-foreground">Short-Term Gains</div>
                      <div className="font-medium mt-1">{formatCurrency(taxResult.shortTermGains)}</div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-muted-foreground">Long-Term Gains</div>
                      <div className="font-medium mt-1">{formatCurrency(taxResult.longTermGains)}</div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-muted-foreground">CGT Discount</div>
                      <div className="font-medium mt-1">{formatCurrency(taxResult.CGTDiscount || 0)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={calculateTax}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Recalculate
                  </Button>
                  <Button onClick={exportTaxReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tax calculation results yet.</p>
                <p className="text-sm mt-1">Use the calculator tab to generate your tax estimate.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">ATO Cryptocurrency Tax Guidelines</h3>
                <p className="text-muted-foreground">
                  The Australian Taxation Office (ATO) considers cryptocurrency to be an asset for capital gains tax purposes.
                  Here's what you need to know about cryptocurrency taxation in Australia:
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Capital Gains Tax (CGT)</h4>
                <p className="text-muted-foreground text-sm mb-2">
                  When you dispose of cryptocurrency, you may trigger a capital gains tax event. Disposing includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Selling cryptocurrency for fiat currency</li>
                  <li>Trading or exchanging one cryptocurrency for another</li>
                  <li>Using cryptocurrency to purchase goods or services</li>
                  <li>Gifting cryptocurrency to another person</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Record Keeping</h4>
                <p className="text-muted-foreground text-sm mb-2">
                  The ATO requires you to keep detailed records of all cryptocurrency transactions, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Date of each transaction</li>
                  <li>Value in Australian dollars at the time of transaction</li>
                  <li>Purpose of the transaction and who the other party was</li>
                  <li>Transaction receipts or exchange records</li>
                  <li>Commission or fees paid</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">CGT Discount</h4>
                <p className="text-muted-foreground text-sm">
                  If you're an individual or small business entity and hold cryptocurrency for more than 12 months before 
                  disposing of it, you may be eligible for the 50% CGT discount on any capital gain.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Personal Use Asset</h4>
                <p className="text-muted-foreground text-sm">
                  If cryptocurrency is acquired for personal use and the cost is under $10,000, any capital gain may be disregarded. 
                  However, the ATO generally does not consider cryptocurrency to be a personal use asset if it is held as an investment.
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mt-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info size={16} />
                  Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground">
                  This information is general in nature and should not be relied upon as tax advice.
                  For specific advice relevant to your situation, please consult with a registered tax agent or contact the ATO directly.
                </p>
                <div className="mt-3">
                  <a 
                    href="https://www.ato.gov.au/individuals/investments-and-assets/crypto-assets/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-600 hover:text-blue-800"
                  >
                    Visit the ATO website for more information
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
