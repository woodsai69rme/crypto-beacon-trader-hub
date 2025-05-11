
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATOTaxCalculation } from "@/types/ATOTaxCalculation";

const financialYears = [
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020"
];

const ATOTaxCalculator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [financialYear, setFinancialYear] = useState("2023-2024");
  const [income, setIncome] = useState<string>("85000");
  const [capitalGains, setCapitalGains] = useState<string>("15000");
  const [taxWithheld, setTaxWithheld] = useState<string>("19500");
  const [taxDeductions, setTaxDeductions] = useState<string>("3000");
  const [holdingPeriod, setHoldingPeriod] = useState<string>("long-term"); // long-term or short-term
  
  const [taxResult, setTaxResult] = useState<ATOTaxCalculation | null>(null);
  
  const handleCalculateTax = () => {
    // Parse inputs to numbers
    const incomeNum = parseFloat(income) || 0;
    const capitalGainsNum = parseFloat(capitalGains) || 0;
    const taxWithheldNum = parseFloat(taxWithheld) || 0;
    const taxDeductionsNum = parseFloat(taxDeductions) || 0;
    
    // Apply CGT discount for long-term holdings (>12 months in Australia)
    const cgtDiscount = holdingPeriod === 'long-term' ? 0.5 : 0;
    const netCapitalGains = capitalGainsNum * (1 - cgtDiscount);
    
    // Calculate taxable income
    const taxableIncome = incomeNum + netCapitalGains - taxDeductionsNum;
    
    // Australian tax rates 2023-2024
    let taxPayable = 0;
    let taxRate = 0;
    let bracketInfo = { bracket: "", rate: "" };
    
    // Calculate tax based on 2023-2024 ATO rates
    if (taxableIncome <= 18200) {
      taxPayable = 0;
      taxRate = 0;
      bracketInfo = { bracket: "$0 - $18,200", rate: "0%" };
    } else if (taxableIncome <= 45000) {
      taxPayable = (taxableIncome - 18200) * 0.19;
      taxRate = 0.19;
      bracketInfo = { bracket: "$18,201 - $45,000", rate: "19%" };
    } else if (taxableIncome <= 120000) {
      taxPayable = 5092 + (taxableIncome - 45000) * 0.325;
      taxRate = 0.325;
      bracketInfo = { bracket: "$45,001 - $120,000", rate: "32.5%" };
    } else if (taxableIncome <= 180000) {
      taxPayable = 29467 + (taxableIncome - 120000) * 0.37;
      taxRate = 0.37;
      bracketInfo = { bracket: "$120,001 - $180,000", rate: "37%" };
    } else {
      taxPayable = 51667 + (taxableIncome - 180000) * 0.45;
      taxRate = 0.45;
      bracketInfo = { bracket: "$180,001+", rate: "45%" };
    }
    
    // Calculate Medicare levy (2% of taxable income)
    const medicareLevyRate = 0.02;
    const medicareLevy = taxableIncome * medicareLevyRate;
    
    // Total tax liability
    const totalTaxLiability = taxPayable + medicareLevy;
    
    // Tax refund or amount owed
    const taxRefundOrOwed = totalTaxLiability - taxWithheldNum;
    
    // Set the tax result
    setTaxResult({
      financialYear,
      taxableIncome,
      capitalGainsIncome: capitalGainsNum,
      taxRate,
      medicareLevyRate,
      taxPayable,
      medicareLevy,
      totalTaxLiability,
      taxCredits: taxWithheldNum,
      taxRefundOrOwed,
      incomeTax: taxPayable,
      taxWithheld: taxWithheldNum,
      netCapitalGains,
      assessableIncome: taxableIncome,
      bracketInfo,
      capitalGains: capitalGainsNum,
      CGTDiscount: cgtDiscount
    });
    
    setStep(2);
  };
  
  const resetCalculator = () => {
    setStep(1);
    setTaxResult(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Australian Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income Tax</TabsTrigger>
            <TabsTrigger value="capital-gains">Capital Gains</TabsTrigger>
          </TabsList>
          
          {step === 1 ? (
            <>
              <TabsContent value="income" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="financial-year">Financial Year</Label>
                    <Select value={financialYear} onValueChange={setFinancialYear}>
                      <SelectTrigger id="financial-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {financialYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="income">Annual Income (A$)</Label>
                    <Input 
                      id="income" 
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="Enter your total income"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="tax-withheld">Tax Withheld (A$)</Label>
                    <Input 
                      id="tax-withheld" 
                      type="number" 
                      value={taxWithheld}
                      onChange={(e) => setTaxWithheld(e.target.value)}
                      placeholder="Enter tax already withheld"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="deductions">Deductions (A$)</Label>
                    <Input 
                      id="deductions" 
                      type="number" 
                      value={taxDeductions}
                      onChange={(e) => setTaxDeductions(e.target.value)}
                      placeholder="Enter total deductions"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="capital-gains" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="capital-gains">Capital Gains (A$)</Label>
                    <Input 
                      id="capital-gains" 
                      type="number"
                      value={capitalGains}
                      onChange={(e) => setCapitalGains(e.target.value)}
                      placeholder="Enter your total capital gains"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="holding-period">Holding Period</Label>
                    <Select value={holdingPeriod} onValueChange={setHoldingPeriod}>
                      <SelectTrigger id="holding-period">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long-term">Long-term (>12 months)</SelectItem>
                        <SelectItem value="short-term">Short-term (≤12 months)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground mt-1">
                      Long-term holdings (>12 months) receive a 50% CGT discount in Australia
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleCalculateTax}
              >
                Calculate Tax
              </Button>
            </>
          ) : (
            <div className="mt-6 space-y-6">
              {taxResult && (
                <>
                  <div className="border rounded-lg p-6 bg-muted/20">
                    <h3 className="text-lg font-medium mb-4">Tax Summary for {taxResult.financialYear}</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span>Tax Bracket</span>
                        <span className="font-medium">{taxResult.bracketInfo.bracket} ({taxResult.bracketInfo.rate})</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Assessable Income</div>
                          <div className="font-medium">A${taxResult.assessableIncome.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Net Capital Gains</div>
                          <div className="font-medium">A${taxResult.netCapitalGains.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Income Tax</div>
                          <div className="font-medium">A${taxResult.incomeTax.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Medicare Levy</div>
                          <div className="font-medium">A${taxResult.medicareLevy.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span>Total Tax Liability</span>
                          <span className="font-bold">A${taxResult.totalTaxLiability.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span>Tax Already Withheld</span>
                          <span className="font-medium">A${taxResult.taxWithheld.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-lg">
                          <span>{taxResult.taxRefundOrOwed > 0 ? 'Tax Payable' : 'Tax Refund'}</span>
                          <span className={`font-bold ${taxResult.taxRefundOrOwed > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            A${Math.abs(taxResult.taxRefundOrOwed).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Capital Gains Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Capital Gains</span>
                        <span className="font-medium">A${taxResult.capitalGains.toLocaleString()}</span>
                      </div>
                      
                      {taxResult.CGTDiscount > 0 && (
                        <div className="flex justify-between items-center">
                          <span>CGT Discount (50%)</span>
                          <span className="font-medium">-A${(taxResult.capitalGains * taxResult.CGTDiscount).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span>Net Capital Gains</span>
                        <span className="font-bold">A${taxResult.netCapitalGains.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span>Tax on Capital Gains</span>
                        <span className="font-bold">A${(taxResult.netCapitalGains * taxResult.taxRate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={resetCalculator}
              >
                Calculate Another
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                This calculator provides estimates only and should not be used as a substitute for professional tax advice.
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
