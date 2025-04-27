
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { ATOTaxCalculation, ATOTaxRate } from "@/types/trading";

const ATOTaxCalculator = () => {
  // Current supported tax rates as of 2023-2024
  const taxRates: ATOTaxRate[] = [
    { minIncome: 0, maxIncome: 18200, baseAmount: 0, marginRate: 0, year: "2023-2024" },
    { minIncome: 18201, maxIncome: 45000, baseAmount: 0, marginRate: 0.19, year: "2023-2024" },
    { minIncome: 45001, maxIncome: 120000, baseAmount: 5092, marginRate: 0.325, year: "2023-2024" },
    { minIncome: 120001, maxIncome: 180000, baseAmount: 29467, marginRate: 0.37, year: "2023-2024" },
    { minIncome: 180001, maxIncome: null, baseAmount: 51667, marginRate: 0.45, year: "2023-2024" }
  ];

  const [financialYear, setFinancialYear] = useState<string>("2023-2024");
  const [assessableIncome, setAssessableIncome] = useState<number>(85000);
  const [capitalGains, setCapitalGains] = useState<number>(15000);
  const [holdingPeriod, setHoldingPeriod] = useState<string>("over12months"); 
  const [deductions, setDeductions] = useState<number>(3000);
  const [taxWithheld, setTaxWithheld] = useState<number>(19500);
  const [includeCapitalGains, setIncludeCapitalGains] = useState<boolean>(true);
  const [includeDiscount, setIncludeDiscount] = useState<boolean>(true);
  
  const [result, setResult] = useState<ATOTaxCalculation | null>(null);
  
  const { activeCurrency, formatValue } = useCurrencyConverter();
  
  const calculateTax = () => {
    try {
      // Apply capital gains tax discount if applicable
      let effectiveCapitalGains = includeCapitalGains ? capitalGains : 0;
      let discountedCapitalGains = 0;
      
      if (includeDiscount && holdingPeriod === "over12months") {
        // 50% CGT discount for assets held over 12 months
        discountedCapitalGains = effectiveCapitalGains * 0.5;
        effectiveCapitalGains = discountedCapitalGains;
      }

      // Calculate taxable income
      const taxableIncome = assessableIncome + effectiveCapitalGains - deductions;
      
      // Find applicable tax bracket
      const taxBracket = taxRates.find(rate => 
        taxableIncome > rate.minIncome && 
        (rate.maxIncome === null || taxableIncome <= rate.maxIncome)
      );
      
      if (!taxBracket) {
        throw new Error("Could not determine tax bracket");
      }
      
      // Calculate tax payable
      const baseTax = taxBracket.baseAmount;
      const marginTax = (taxableIncome - taxBracket.minIncome) * taxBracket.marginRate;
      const taxPayable = baseTax + marginTax;
      
      // Medicare levy is 2% of taxable income (simplified)
      const medicareLevy = taxableIncome * 0.02;
      
      // Calculate refund or amount owing
      const taxRefundOrOwed = taxWithheld - (taxPayable + medicareLevy);
      
      const calculation: ATOTaxCalculation = {
        financialYear,
        assessableIncome,
        capitalGains: includeCapitalGains ? capitalGains : 0,
        shortTermGains: holdingPeriod === "under12months" ? effectiveCapitalGains : 0,
        longTermGains: holdingPeriod === "over12months" ? capitalGains : 0,
        CGTDiscount: includeDiscount && holdingPeriod === "over12months" ? capitalGains * 0.5 : 0,
        deductions,
        taxableIncome,
        taxPayable,
        medicareLevyPayable: medicareLevy,
        taxWithheld,
        taxRefundOrOwed,
        currency: "AUD"
      };
      
      setResult(calculation);
      
      const resultMessage = taxRefundOrOwed >= 0 
        ? `You're eligible for a refund of ${formatValue(taxRefundOrOwed, 'AUD')}`
        : `You owe ${formatValue(Math.abs(taxRefundOrOwed), 'AUD')}`;
      
      toast({
        title: "Tax Calculation Complete",
        description: resultMessage
      });
    } catch (error) {
      console.error("Tax calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate tax. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Australian Tax Office Tax Calculator</CardTitle>
        <CardDescription>Estimate your Australian tax obligations for crypto investments</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="financial-year">Financial Year</Label>
              <Select 
                value={financialYear} 
                onValueChange={setFinancialYear}
              >
                <SelectTrigger id="financial-year">
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2021-2022">2021-2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="assessable-income">Assessable Income (AUD)</Label>
              <Input
                id="assessable-income"
                type="number"
                value={assessableIncome}
                onChange={(e) => setAssessableIncome(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your total income from salary, investments, etc.
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="capital-gains">Capital Gains (AUD)</Label>
                <div className="flex items-center">
                  <input
                    type="checkbox" 
                    id="include-cgt"
                    checked={includeCapitalGains}
                    onChange={(e) => setIncludeCapitalGains(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="include-cgt" className="text-sm">Include CGT</Label>
                </div>
              </div>
              <Input
                id="capital-gains"
                type="number"
                value={capitalGains}
                onChange={(e) => setCapitalGains(parseFloat(e.target.value) || 0)}
                disabled={!includeCapitalGains}
              />
            </div>
            
            <div>
              <Label htmlFor="holding-period">Holding Period</Label>
              <Select 
                value={holdingPeriod} 
                onValueChange={setHoldingPeriod}
                disabled={!includeCapitalGains}
              >
                <SelectTrigger id="holding-period">
                  <SelectValue placeholder="Select holding period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under12months">Less than 12 months</SelectItem>
                  <SelectItem value="over12months">More than 12 months</SelectItem>
                </SelectContent>
              </Select>
              
              {holdingPeriod === "over12months" && includeCapitalGains && (
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox" 
                    id="include-discount"
                    checked={includeDiscount}
                    onChange={(e) => setIncludeDiscount(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="include-discount" className="text-sm">Apply 50% CGT discount</Label>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="deductions">Deductions (AUD)</Label>
              <Input
                id="deductions"
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Work-related expenses, donations, etc.
              </p>
            </div>
            
            <div>
              <Label htmlFor="tax-withheld">Tax Withheld (AUD)</Label>
              <Input
                id="tax-withheld"
                type="number"
                value={taxWithheld}
                onChange={(e) => setTaxWithheld(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                PAYG or other tax withheld during the year
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={calculateTax} className="w-full">Calculate Tax</Button>
            </div>
          </div>
          
          <div>
            {result ? (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-medium">Tax Summary for {result.financialYear}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Assessable Income:</span>
                    <span>{formatValue(result.assessableIncome, 'AUD')}</span>
                  </div>
                  
                  {result.capitalGains > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Capital Gains:</span>
                        <span>{formatValue(result.capitalGains, 'AUD')}</span>
                      </div>
                      
                      {result.CGTDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>CGT Discount:</span>
                          <span>-{formatValue(result.CGTDiscount, 'AUD')}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Deductions:</span>
                    <span>-{formatValue(result.deductions, 'AUD')}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Taxable Income:</span>
                    <span>{formatValue(result.taxableIncome, 'AUD')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Income Tax:</span>
                    <span>{formatValue(result.taxPayable, 'AUD')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Medicare Levy:</span>
                    <span>{formatValue(result.medicareLevyPayable, 'AUD')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Tax:</span>
                    <span>{formatValue(result.taxPayable + result.medicareLevyPayable, 'AUD')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax Withheld:</span>
                    <span>{formatValue(result.taxWithheld, 'AUD')}</span>
                  </div>
                  
                  <div className={`flex justify-between font-medium border-t pt-2 ${
                    result.taxRefundOrOwed >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{result.taxRefundOrOwed >= 0 ? 'Tax Refund:' : 'Tax Owed:'}</span>
                    <span>
                      {result.taxRefundOrOwed >= 0 
                        ? formatValue(result.taxRefundOrOwed, 'AUD')
                        : formatValue(Math.abs(result.taxRefundOrOwed), 'AUD')}
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
                  <strong>Disclaimer:</strong> This is only an estimate and should not be used for making financial decisions. 
                  Consult with a qualified tax professional for accurate tax advice based on your personal circumstances.
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Complete the form</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in your details on the left to calculate your Australian tax obligations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
