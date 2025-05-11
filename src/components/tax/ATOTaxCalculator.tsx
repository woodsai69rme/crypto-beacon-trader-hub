import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowUpDown, Calculator, Download, InfoIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ATOTaxCalculation } from '@/types/trading';

const ATOTaxCalculator: React.FC = () => {
  const [taxYear, setTaxYear] = useState('2024-2025');
  const [income, setIncome] = useState<number>(85000);
  const [capitalGains, setCapitalGains] = useState<number>(15000);
  const [deductions, setDeductions] = useState<number>(3000);
  const [taxWithheld, setTaxWithheld] = useState<number>(22000);
  const [calculation, setCalculation] = useState<ATOTaxCalculation | null>(null);
  const [activeTab, setActiveTab] = useState<string>("simple");

  const calculateTax = () => {
    const taxableIncome = income - deductions;
    let taxRate = 0;
    let incomeTax = 0;
    let bracketInfo = '';

    // ATO 2024-2025 tax brackets (example)
    if (taxableIncome <= 18200) {
      taxRate = 0;
      incomeTax = 0;
      bracketInfo = '0-$18,200: 0%';
    } else if (taxableIncome <= 45000) {
      taxRate = 0.19;
      incomeTax = (taxableIncome - 18200) * 0.19;
      bracketInfo = '$18,201-$45,000: 19c for each $1 over $18,200';
    } else if (taxableIncome <= 120000) {
      taxRate = 0.325;
      incomeTax = 5092 + (taxableIncome - 45000) * 0.325;
      bracketInfo = '$45,001-$120,000: $5,092 plus 32.5c for each $1 over $45,000';
    } else if (taxableIncome <= 180000) {
      taxRate = 0.37;
      incomeTax = 29467 + (taxableIncome - 120000) * 0.37;
      bracketInfo = '$120,001-$180,000: $29,467 plus 37c for each $1 over $120,000';
    } else {
      taxRate = 0.45;
      incomeTax = 51667 + (taxableIncome - 180000) * 0.45;
      bracketInfo = '$180,001 and over: $51,667 plus 45c for each $1 over $180,000';
    }

    // Calculate capital gains tax
    const CGTDiscount = capitalGains > 0 ? capitalGains * 0.5 : 0;
    const netCapitalGains = capitalGains - CGTDiscount;
    const assessableIncome = taxableIncome + netCapitalGains;
    
    // Calculate medicare levy
    const medicareLevyRate = 0.02; // 2%
    const medicareLevy = assessableIncome * medicareLevyRate;
    
    // Calculate total tax
    const totalTaxLiability = incomeTax + medicareLevy;
    const taxRefundOrOwed = taxWithheld - totalTaxLiability;
    
    setCalculation({
      financialYear: taxYear,
      taxableIncome: taxableIncome,
      capitalGainsIncome: netCapitalGains,
      taxRate: taxRate,
      medicareLevyRate: medicareLevyRate,
      taxPayable: incomeTax,
      medicareLevy: medicareLevy,
      totalTaxLiability: totalTaxLiability,
      taxCredits: 0,
      taxRefundOrOwed: taxRefundOrOwed,
      incomeTax: incomeTax,
      taxWithheld: taxWithheld,
      netCapitalGains: netCapitalGains,
      assessableIncome: assessableIncome,
      bracketInfo: {
        bracket: bracketInfo,
        rate: `${(taxRate * 100).toFixed(1)}%`
      },
      capitalGains: capitalGains,
      CGTDiscount: CGTDiscount
    });
  };

  const downloadTaxReport = () => {
    if (!calculation) return;
    
    const report = `
Tax Calculation Report
=====================
Financial Year: ${calculation.financialYear}
Generated on: ${new Date().toLocaleDateString()}

Income Summary
-------------
Gross Income: $${income.toLocaleString()}
Deductions: $${deductions.toLocaleString()}
Taxable Income: $${calculation.taxableIncome.toLocaleString()}

Capital Gains
------------
Total Capital Gains: $${capitalGains.toLocaleString()}
CGT Discount (50%): $${calculation.CGTDiscount?.toLocaleString()}
Net Capital Gains: $${calculation.netCapitalGains.toLocaleString()}

Tax Calculation
--------------
Tax Bracket: ${calculation.bracketInfo?.bracket}
Income Tax: $${calculation.incomeTax.toLocaleString()}
Medicare Levy (2%): $${calculation.medicareLevy.toLocaleString()}
Total Tax Liability: $${calculation.totalTaxLiability.toLocaleString()}

Summary
-------
Tax Withheld: $${calculation.taxWithheld.toLocaleString()}
Tax Refund/Owed: $${Math.abs(calculation.taxRefundOrOwed).toLocaleString()} ${calculation.taxRefundOrOwed >= 0 ? '(Refund)' : '(Owed)'}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_report_${calculation.financialYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ATO Tax Calculator
        </CardTitle>
        <CardDescription>
          Calculate your Australian tax obligations for crypto trading
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4" content={null}>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-year">Financial Year</Label>
                    <Select defaultValue={taxYear} onValueChange={setTaxYear}>
                      <SelectTrigger id="tax-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2022-2023">2022-2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income (AUD)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="income"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <div className="w-20 text-right font-mono">${income.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="capital-gains">Capital Gains (AUD)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[220px] text-sm">Total profit from crypto trading in this financial year</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="capital-gains"
                        type="number"
                        value={capitalGains}
                        onChange={(e) => setCapitalGains(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <div className="w-20 text-right font-mono">${capitalGains.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions (AUD)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="deductions"
                        type="number"
                        value={deductions}
                        onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <div className="w-20 text-right font-mono">${deductions.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-withheld">Tax Already Withheld (AUD)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="tax-withheld"
                        type="number"
                        value={taxWithheld}
                        onChange={(e) => setTaxWithheld(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <div className="w-20 text-right font-mono">${taxWithheld.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <Button onClick={calculateTax} className="w-full mt-4">Calculate Tax</Button>
                </div>
                
                {calculation ? (
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Tax Summary</h3>
                      <Button variant="outline" size="sm" onClick={downloadTaxReport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxable Income:</span>
                        <span className="font-mono">${calculation.taxableIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span className="text-muted-foreground">Net Capital Gains:</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[220px] text-sm">Capital gains with 50% discount applied for assets held over 12 months</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="font-mono">${calculation.netCapitalGains.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Bracket:</span>
                        <span className="font-mono">{calculation.bracketInfo?.rate}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Income Tax:</span>
                        <span className="font-mono">${calculation.incomeTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medicare Levy (2%):</span>
                        <span className="font-mono">${calculation.medicareLevy.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Tax Liability:</span>
                        <span className="font-mono">${calculation.totalTaxLiability.toLocaleString()}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Already Withheld:</span>
                        <span className="font-mono">${calculation.taxWithheld.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{calculation.taxRefundOrOwed >= 0 ? 'Tax Refund:' : 'Tax Owed:'}</span>
                        <span className={`font-mono ${calculation.taxRefundOrOwed >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${Math.abs(calculation.taxRefundOrOwed).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 text-center flex flex-col items-center justify-center text-muted-foreground">
                    <Calculator className="h-12 w-12 mb-3 opacity-50" />
                    <p>Enter your details and click Calculate</p>
                    <p className="text-sm mt-2">Your tax calculation will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Advanced Tax Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      For detailed tax calculations including specific deductions, holdings periods, and more advanced options.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Apply 50% CGT Discount</Label>
                          <p className="text-sm text-muted-foreground">For assets held over 12 months</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Include First Home Super Saver Scheme</Label>
                          <p className="text-sm text-muted-foreground">For saving towards your first home</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>HELP/HECS Debt Repayments</Label>
                          <p className="text-sm text-muted-foreground">Calculate higher education loan repayments</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="opacity-75 pointer-events-none">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      Professional Features
                      <span className="bg-primary text-primary-foreground text-xs py-1 px-2 rounded-md">
                        PREMIUM
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Access professional tax planning tools with detailed projections and optimization suggestions.
                    </p>
                    <div className="space-y-4 opacity-75">
                      <div>
                        <Label className="mb-2 block">Tax Planning</Label>
                        <Slider disabled defaultValue={[33]} max={100} step={1} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Tax Loss Harvesting Analysis</Label>
                          <p className="text-sm text-muted-foreground">Optimize your crypto tax position</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <Button className="w-full" disabled>Upgrade to Premium</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4 text-sm text-muted-foreground">
        <div>Updated for {taxYear} tax year</div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Last updated: May 1, 2025</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ATOTaxCalculator;
