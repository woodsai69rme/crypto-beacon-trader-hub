
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ATOTaxCalculation, ATOTaxRate } from '@/types/trading';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Formatting utilities
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// ATO tax rates for 2023-2024
const taxRates2023: ATOTaxRate[] = [
  { year: 2023, minIncome: 0, maxIncome: 18200, baseAmount: 0, marginRate: 0 },
  { year: 2023, minIncome: 18201, maxIncome: 45000, baseAmount: 0, marginRate: 0.19 },
  { year: 2023, minIncome: 45001, maxIncome: 120000, baseAmount: 5092, marginRate: 0.325 },
  { year: 2023, minIncome: 120001, maxIncome: 180000, baseAmount: 29467, marginRate: 0.37 },
  { year: 2023, minIncome: 180001, maxIncome: null, baseAmount: 51667, marginRate: 0.45 }
];

// Empty calculator result
const emptyCalculation: ATOTaxCalculation = {
  year: 2023,
  taxYear: '2023-2024',
  assessableIncome: 0,
  taxableIncome: 0,
  bracketInfo: taxRates2023[0],
  taxPayable: 0,
  taxWithheld: 0,
  taxRefundOrOwed: 0,
  capitalGains: 0,
  CGTDiscount: 0,
  deductions: 0,
  effectiveTaxRate: 0,
  effectiveRate: 0,
  marginalRate: 0,
  takeHome: 0,
  medicareLevyPayable: 0,
  income: 0,
  breakdown: []
};

const ATOTaxCalculator: React.FC = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState<number>(85000);
  const [taxWithheld, setTaxWithheld] = useState<number>(19500);
  const [deductions, setDeductions] = useState<number>(3000);
  const [capitalGains, setCapitalGains] = useState<number>(10000);
  const [longTermCGT, setLongTermCGT] = useState<boolean>(true);
  const [result, setResult] = useState<ATOTaxCalculation>(emptyCalculation);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateTax = () => {
    try {
      // Calculate taxable income
      const cgtDiscount = longTermCGT ? capitalGains * 0.5 : 0;
      const taxableIncome = income - deductions + (capitalGains - cgtDiscount);

      // Find applicable tax bracket
      const bracket = taxRates2023.find(
        rate => taxableIncome >= rate.minIncome && 
                (rate.maxIncome === null || taxableIncome <= rate.maxIncome)
      ) || taxRates2023[0];

      // Calculate base tax
      const baseTax = bracket.baseAmount + 
        (taxableIncome - bracket.minIncome) * bracket.marginRate;
      
      // Medicare levy (2% of taxable income)
      const medicareLevy = taxableIncome * 0.02;
      
      // Total tax payable
      const totalTaxPayable = baseTax + medicareLevy;
      
      // Tax refund or amount owing
      const taxRefundOrOwed = taxWithheld - totalTaxPayable;
      
      // Effective tax rate
      const effectiveTaxRate = (totalTaxPayable / taxableIncome) * 100;

      // Tax breakdown by brackets
      const breakdown = [];
      let remainingIncome = taxableIncome;
      let currentBracketIndex = 0;

      while (remainingIncome > 0 && currentBracketIndex < taxRates2023.length) {
        const currentBracket = taxRates2023[currentBracketIndex];
        const nextBracket = taxRates2023[currentBracketIndex + 1];
        
        const bracketMin = currentBracket.minIncome;
        const bracketMax = currentBracket.maxIncome !== null ? 
          currentBracket.maxIncome : remainingIncome + bracketMin;
        
        const incomeInBracket = Math.min(
          remainingIncome,
          bracketMax - bracketMin + 1
        );
        
        const taxForBracket = incomeInBracket * currentBracket.marginRate;
        
        breakdown.push({
          bracket: `$${bracketMin.toLocaleString()} - ${
            currentBracket.maxIncome !== null 
              ? `$${currentBracket.maxIncome.toLocaleString()}` 
              : 'and above'
          }`,
          amount: incomeInBracket,
          tax: taxForBracket
        });
        
        remainingIncome -= incomeInBracket;
        currentBracketIndex++;
      }

      // Set the calculated results
      const newResult: ATOTaxCalculation = {
        year: 2023,
        taxYear: '2023-2024',
        assessableIncome: income,
        taxableIncome: taxableIncome,
        bracketInfo: bracket,
        taxPayable: totalTaxPayable,
        taxWithheld: taxWithheld,
        taxRefundOrOwed: taxRefundOrOwed,
        capitalGains: capitalGains,
        CGTDiscount: cgtDiscount,
        deductions: deductions,
        effectiveTaxRate: effectiveTaxRate,
        effectiveRate: effectiveTaxRate,
        marginalRate: bracket.marginRate * 100,
        takeHome: income - totalTaxPayable,
        medicareLevyPayable: medicareLevy,
        income: income,
        breakdown: breakdown,
      };

      setResult(newResult);
      setShowResults(true);
      
      toast({
        title: "Tax calculation completed",
        description: `Your ${newResult.taxYear} tax estimate is ready.`,
      });
    } catch (error) {
      console.error("Error calculating tax:", error);
      toast({
        title: "Calculation Error",
        description: "There was a problem calculating your tax. Please check your inputs.",
        variant: "destructive",
      });
    }
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
              <Select value="2023-2024" onValueChange={() => {}}>
                <SelectTrigger id="tax-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="cgt-discount"
                checked={longTermCGT}
                onCheckedChange={setLongTermCGT}
              />
              <Label htmlFor="cgt-discount">Apply 50% CGT discount (for assets held &gt; 12 months)</Label>
            </div>
          </div>
          
          <Button className="w-full mt-4" onClick={calculateTax}>
            Calculate Tax
          </Button>
        </CardContent>
      </Card>
      
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation Results</CardTitle>
            <CardDescription>
              {result.taxYear} Financial Year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Assessable Income</p>
                <p className="text-xl font-semibold">{formatCurrency(result.assessableIncome)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="text-xl font-semibold">{formatCurrency(result.taxableIncome)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Tax Payable</p>
                <p className="text-xl font-semibold">{formatCurrency(result.taxPayable)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Medicare Levy</p>
                <p className="text-xl font-semibold">{formatCurrency(result.medicareLevyPayable)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground">Tax Withheld</p>
                <p className="text-xl font-semibold">{formatCurrency(result.taxWithheld)}</p>
              </div>
              
              <div className={`border rounded-md p-4 ${result.taxRefundOrOwed >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                <p className="text-sm text-muted-foreground">
                  {result.taxRefundOrOwed >= 0 ? "Tax Refund" : "Tax Payable"}
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(Math.abs(result.taxRefundOrOwed))}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Tax Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Effective Tax Rate:</div>
                <div className="text-right">{formatPercentage(result.effectiveTaxRate)}</div>
                
                <div>Marginal Tax Rate:</div>
                <div className="text-right">{formatPercentage(result.marginalRate)}</div>
                
                <div>Capital Gains (before discount):</div>
                <div className="text-right">{formatCurrency(result.capitalGains)}</div>
                
                <div>CGT Discount Applied:</div>
                <div className="text-right">{formatCurrency(result.CGTDiscount)}</div>
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
                  {result.breakdown.map((item, index) => (
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
                    <TableCell className="text-right">{formatCurrency(result.taxableIncome)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(result.taxPayable)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-muted-foreground">
            <p>This is an estimate only. Please consult a tax professional for advice.</p>
            <p>Tax rates are based on ATO resident individual rates for {result.taxYear}.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ATOTaxCalculator;
