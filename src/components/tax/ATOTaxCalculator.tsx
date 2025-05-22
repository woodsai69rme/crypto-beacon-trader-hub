
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Trade, TaxBracket, ATOTaxCalculation } from '@/types/trading';

interface ATOTaxCalculatorProps {
  trades?: Trade[];
}

const ATOTaxCalculator: React.FC<ATOTaxCalculatorProps> = ({ trades = [] }) => {
  const { formatCurrency } = useCurrency();
  const [taxYear, setTaxYear] = useState<number>(2025);
  const [taxableIncome, setTaxableIncome] = useState<number>(85000);
  const [calculationResult, setCalculationResult] = useState<ATOTaxCalculation | null>(null);

  // Tax brackets for 2022-2023
  const taxBrackets: TaxBracket[] = [
    {
      bracket: "$0 - $18,200",
      rate: "0%",
      min: 0,
      max: 18200
    },
    {
      bracket: "$18,201 - $45,000",
      rate: "19%",
      min: 18201,
      max: 45000
    },
    {
      bracket: "$45,001 - $120,000",
      rate: "32.5%",
      min: 45001,
      max: 120000
    },
    {
      bracket: "$120,001 - $180,000",
      rate: "37%",
      min: 120001,
      max: 180000
    },
    {
      bracket: "$180,001+",
      rate: "45%",
      min: 180001,
      max: Infinity
    }
  ];
  
  const years = [2025, 2024, 2023, 2022, 2021, 2020];

  const calculateTax = () => {
    // Mock calculation for demonstration purposes
    const gains = 45000; // Total capital gains
    const losses = 15000; // Total capital losses
    const netPosition = gains - losses;
    const CGTDiscount = netPosition > 0 ? netPosition * 0.5 : 0; // 50% CGT discount for assets held over 12 months
    const taxableAmount = netPosition - CGTDiscount;
    
    // Find the applicable tax bracket
    let bracketInfo: TaxBracket | undefined;
    for (const bracket of taxBrackets) {
      if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
        bracketInfo = bracket;
        break;
      }
    }
    
    if (!bracketInfo) {
      bracketInfo = taxBrackets[0]; // Default to the first bracket
    }
    
    // Extract rate as a number
    const rateString = bracketInfo.rate;
    const ratePercentage = parseFloat(rateString.replace('%', ''));
    const taxRate = ratePercentage / 100;
    
    // Calculate tax on the taxable amount
    const taxOwed = taxableAmount * taxRate;
    const effectiveTaxRate = (taxOwed / netPosition) * 100;
    
    // Calculate medicare levy (2% of taxable income)
    const medicareLevy = taxableIncome * 0.02;
    
    // Generate sample transactions
    const transactions = [
      {
        date: '2023-03-15',
        asset: 'Bitcoin',
        quantity: 0.5,
        costBase: 20000,
        proceedsAmount: 35000,
        gainLoss: 15000,
        isShortTerm: false,
      },
      {
        date: '2023-05-22',
        asset: 'Ethereum',
        quantity: 5,
        costBase: 15000,
        proceedsAmount: 40000,
        gainLoss: 25000,
        isShortTerm: false,
      },
      {
        date: '2023-07-10',
        asset: 'Cardano',
        quantity: 10000,
        costBase: 12000,
        proceedsAmount: 7000,
        gainLoss: -5000,
        isShortTerm: true,
      },
      {
        date: '2023-09-05',
        asset: 'Solana',
        quantity: 50,
        costBase: 8000,
        proceedsAmount: 18000,
        gainLoss: 10000,
        isShortTerm: true,
      },
      {
        date: '2023-11-20',
        asset: 'XRP',
        quantity: 5000,
        costBase: 7000,
        proceedsAmount: 2000,
        gainLoss: -5000,
        isShortTerm: true,
      },
      {
        date: '2023-12-15',
        asset: 'Polkadot',
        quantity: 200,
        costBase: 6000,
        proceedsAmount: 11000,
        gainLoss: 5000,
        isShortTerm: true,
      },
    ];
    
    // Calculate income tax based on taxable income and bracket
    let incomeTax = 0;
    let prevMax = 0;
    
    for (const bracket of taxBrackets) {
      if (taxableIncome <= prevMax) break;
      
      const amountInBracket = Math.min(taxableIncome, bracket.max) - prevMax;
      if (amountInBracket <= 0) continue;
      
      const bracketRate = parseFloat(bracket.rate.replace('%', '')) / 100;
      incomeTax += amountInBracket * bracketRate;
      prevMax = bracket.max;
    }
    
    // Set calculation result
    const result: ATOTaxCalculation = {
      year: taxYear,
      gains,
      losses,
      netPosition,
      taxableAmount,
      taxOwed,
      effectiveTaxRate,
      transactions,
      financialYear: `${taxYear - 1}-${taxYear}`,
      taxableIncome,
      CGTDiscount,
      netCapitalGains: taxableAmount,
      bracketInfo,
      incomeTax,
      medicareLevy,
      totalTaxLiability: incomeTax + medicareLevy + taxOwed,
      taxWithheld: taxableIncome * 0.15, // Assume 15% tax withheld
      taxRefundOrOwed: (incomeTax + medicareLevy + taxOwed) - (taxableIncome * 0.15),
    };
    
    setCalculationResult(result);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">ATO Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-year">Tax Year</Label>
              <Select
                value={taxYear.toString()}
                onValueChange={(value) => setTaxYear(Number(value))}
              >
                <SelectTrigger id="tax-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year - 1}/{year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxable-income">Taxable Income (excluding crypto)</Label>
              <Input
                id="taxable-income"
                type="number"
                value={taxableIncome}
                onChange={(e) => setTaxableIncome(Number(e.target.value))}
              />
            </div>
          </div>
          
          <Button onClick={calculateTax}>Calculate Tax</Button>
          
          {calculationResult && (
            <div className="border rounded-md p-4 mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tax Summary for {calculationResult.financialYear} Financial Year</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Capital Gains:</span>
                      <span>{formatCurrency(calculationResult.gains)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Capital Losses:</span>
                      <span>{formatCurrency(calculationResult.losses)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Net Capital Gain/Loss:</span>
                      <span>{formatCurrency(calculationResult.netPosition)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CGT Discount (50%):</span>
                      <span>{formatCurrency(calculationResult.CGTDiscount || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Net Capital Gains (after discount):</span>
                      <span>{formatCurrency(calculationResult.netCapitalGains || 0)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Taxable Income:</span>
                      <span>{formatCurrency(calculationResult.taxableIncome || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax Bracket:</span>
                      <span>{calculationResult.bracketInfo?.bracket}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Marginal Tax Rate:</span>
                      <span>{calculationResult.bracketInfo?.rate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Income Tax:</span>
                      <span>{formatCurrency(calculationResult.incomeTax || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Medicare Levy (2%):</span>
                      <span>{formatCurrency(calculationResult.medicareLevy || 0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Capital Gains Tax Payable:</span>
                    <span>{formatCurrency(calculationResult.taxOwed)}</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Tax Liability:</span>
                    <span>{formatCurrency(calculationResult.totalTaxLiability || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax Withheld:</span>
                    <span>{formatCurrency(calculationResult.taxWithheld || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Tax Refund / Owing:</span>
                    <span className={calculationResult.taxRefundOrOwed && calculationResult.taxRefundOrOwed < 0 
                      ? 'text-green-500 dark:text-green-400' 
                      : 'text-red-500 dark:text-red-400'}>
                      {formatCurrency(calculationResult.taxRefundOrOwed || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">Asset</th>
                        <th className="text-left py-2 px-2">Quantity</th>
                        <th className="text-left py-2 px-2">Cost Base</th>
                        <th className="text-left py-2 px-2">Proceeds</th>
                        <th className="text-left py-2 px-2">Gain/Loss</th>
                        <th className="text-left py-2 px-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.transactions.map((transaction, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-2">{transaction.date}</td>
                          <td className="py-2 px-2">{transaction.asset}</td>
                          <td className="py-2 px-2">{transaction.quantity}</td>
                          <td className="py-2 px-2">{formatCurrency(transaction.costBase)}</td>
                          <td className="py-2 px-2">{formatCurrency(transaction.proceedsAmount)}</td>
                          <td className={`py-2 px-2 ${transaction.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(transaction.gainLoss)}
                          </td>
                          <td className="py-2 px-2">{transaction.isShortTerm ? 'Short Term' : 'Long Term'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
