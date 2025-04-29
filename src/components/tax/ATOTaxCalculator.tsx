
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ATOTaxRate, ATOTaxCalculation } from "@/types/trading";

// ATO tax rates for resident individuals 2022-2023
const taxRates2023: ATOTaxRate[] = [
  { minIncome: 0, maxIncome: 18200, baseAmount: 0, marginRate: 0, year: 2023 },
  { minIncome: 18201, maxIncome: 45000, baseAmount: 0, marginRate: 0.19, year: 2023 },
  { minIncome: 45001, maxIncome: 120000, baseAmount: 5092, marginRate: 0.325, year: 2023 },
  { minIncome: 120001, maxIncome: 180000, baseAmount: 29467, marginRate: 0.37, year: 2023 },
  { minIncome: 180001, maxIncome: Number.POSITIVE_INFINITY, baseAmount: 51667, marginRate: 0.45, year: 2023 }
];

const ATOTaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(85000);
  const [deductions, setDeductions] = useState<number>(3000);
  const [capitalGains, setCapitalGains] = useState<number>(5000);
  const [cgtDiscount, setCgtDiscount] = useState<boolean>(true);
  const [taxWithheld, setTaxWithheld] = useState<number>(20000);
  const [taxYear, setTaxYear] = useState<string>("2022-2023");
  const [calculation, setCalculation] = useState<ATOTaxCalculation | null>(null);
  
  // Calculate tax when inputs change
  useEffect(() => {
    calculateTax();
  }, [income, deductions, capitalGains, cgtDiscount, taxWithheld, taxYear]);
  
  const calculateTax = () => {
    // Convert income, applying the CGT discount if applicable
    const discountedCapitalGains = cgtDiscount ? capitalGains / 2 : capitalGains;
    const assessableIncome = income + discountedCapitalGains - deductions;
    
    // Find tax bracket
    const bracket = findTaxBracket(assessableIncome);
    if (!bracket) {
      toast({
        title: "Error calculating tax",
        description: "Could not determine tax bracket",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate tax payable
    const baseAmount = bracket.baseAmount;
    const marginalRate = bracket.marginRate;
    const marginalAmount = assessableIncome - bracket.minIncome;
    const marginalTax = marginalAmount * marginalRate;
    const totalTax = baseAmount + marginalTax;
    
    // Apply Medicare levy (simplified at 2%)
    const medicareLevy = assessableIncome * 0.02;
    
    // Calculate effective tax rate
    const effectiveRate = (totalTax / assessableIncome) * 100;
    
    // Calculate refund or amount owing
    const taxRefundOrOwed = taxWithheld - totalTax - medicareLevy;
    
    setCalculation({
      taxYear: taxYear,
      year: parseInt(taxYear.split("-")[0]),
      assessableIncome: assessableIncome,
      taxableIncome: assessableIncome,
      bracketInfo: bracket,
      taxPayable: totalTax,
      taxWithheld: taxWithheld,
      taxRefundOrOwed: taxRefundOrOwed,
      capitalGains: capitalGains,
      CGTDiscount: cgtDiscount ? capitalGains / 2 : 0,
      deductions: deductions,
      effectiveTaxRate: effectiveRate,
      effectiveRate: effectiveRate,
      marginalRate: marginalRate * 100,
      takeHome: assessableIncome - totalTax - medicareLevy,
      medicareLevyPayable: medicareLevy,
      income: income,
      breakdown: [
        {
          bracket: `$0 - $18,200`,
          amount: Math.min(18200, assessableIncome),
          tax: 0
        },
        {
          bracket: `$18,201 - $45,000`,
          amount: Math.max(0, Math.min(45000, assessableIncome) - 18200),
          tax: Math.max(0, Math.min(45000, assessableIncome) - 18200) * 0.19
        },
        {
          bracket: `$45,001 - $120,000`,
          amount: Math.max(0, Math.min(120000, assessableIncome) - 45000),
          tax: Math.max(0, Math.min(120000, assessableIncome) - 45000) * 0.325
        },
        {
          bracket: `$120,001 - $180,000`,
          amount: Math.max(0, Math.min(180000, assessableIncome) - 120000),
          tax: Math.max(0, Math.min(180000, assessableIncome) - 120000) * 0.37
        },
        {
          bracket: `$180,001+`,
          amount: Math.max(0, assessableIncome - 180000),
          tax: Math.max(0, assessableIncome - 180000) * 0.45
        }
      ]
    });
  };
  
  const findTaxBracket = (income: number): ATOTaxRate | undefined => {
    return taxRates2023.find(bracket => 
      income >= bracket.minIncome && income <= (bracket.maxIncome || Number.POSITIVE_INFINITY)
    );
  };
  
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatPercentage = (percentage: number): string => {
    return percentage.toFixed(2) + '%';
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numValue = value === '' ? 0 : Number(value.replace(/[^0-9.-]+/g, ''));
    setter(numValue);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Australian Tax Calculator</CardTitle>
          <CardDescription>
            Calculate your estimated tax based on the Australian Taxation Office rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income</Label>
              <Input
                id="income"
                type="text"
                value={income.toString()}
                onChange={(e) => handleInputChange(setIncome, e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax-withheld">Tax Withheld</Label>
              <Input
                id="tax-withheld"
                type="text"
                value={taxWithheld.toString()}
                onChange={(e) => handleInputChange(setTaxWithheld, e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="text"
                value={deductions.toString()}
                onChange={(e) => handleInputChange(setDeductions, e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capital-gains">Capital Gains</Label>
              <Input
                id="capital-gains"
                type="text"
                value={capitalGains.toString()}
                onChange={(e) => handleInputChange(setCapitalGains, e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax-year">Financial Year</Label>
              <Select value={taxYear} onValueChange={setTaxYear}>
                <SelectTrigger id="tax-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="cgt-discount"
                checked={cgtDiscount}
                onCheckedChange={setCgtDiscount}
              />
              <Label htmlFor="cgt-discount">Apply 50% CGT discount (for assets held &gt; 12 months)</Label>
            </div>
          </div>
          
          <Button className="w-full mt-4" onClick={calculateTax}>
            Calculate Tax
          </Button>
        </CardContent>
      </Card>
      
      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation Results</CardTitle>
            <CardDescription>
              {calculation.taxYear} Financial Year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Assessable Income</p>
                <p className="text-xl font-semibold">{formatCurrency(calculation.assessableIncome)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="text-xl font-semibold">{formatCurrency(calculation.taxableIncome)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Tax Payable</p>
                <p className="text-xl font-semibold">{formatCurrency(calculation.taxPayable)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Medicare Levy</p>
                <p className="text-xl font-semibold">{formatCurrency(calculation.medicareLevyPayable)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Tax Withheld</p>
                <p className="text-xl font-semibold">{formatCurrency(calculation.taxWithheld)}</p>
              </div>
              
              <div className={`border rounded-md p-4 ${calculation.taxRefundOrOwed >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                <p className="text-sm text-muted-foreground">
                  {calculation.taxRefundOrOwed >= 0 ? "Tax Refund" : "Tax Payable"}
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(Math.abs(calculation.taxRefundOrOwed))}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Tax Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Effective Tax Rate:</div>
                <div className="text-right">{formatPercentage(calculation.effectiveTaxRate)}</div>
                
                <div>Marginal Tax Rate:</div>
                <div className="text-right">{formatPercentage(calculation.marginalRate)}</div>
                
                <div>Capital Gains (before discount):</div>
                <div className="text-right">{formatCurrency(calculation.capitalGains)}</div>
                
                <div>CGT Discount Applied:</div>
                <div className="text-right">{formatCurrency(calculation.CGTDiscount)}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Tax Breakdown by Bracket</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Income Bracket</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculation.breakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.bracket}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.tax)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{formatCurrency(calculation.taxableIncome)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(calculation.taxPayable)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-muted-foreground">
            <p>This is an estimate only. Please consult a tax professional for advice.</p>
            <p>Tax rates are based on ATO resident individual rates for {calculation.taxYear}.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ATOTaxCalculator;
