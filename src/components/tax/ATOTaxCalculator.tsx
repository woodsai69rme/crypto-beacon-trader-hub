
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Download } from 'lucide-react';
import { ATOTaxCalculation, TaxBracket } from '@/types/trading';

const ATOTaxCalculator: React.FC = () => {
  const [taxableIncome, setTaxableIncome] = useState<number>(75000);
  const [capitalGains, setCapitalGains] = useState<number>(10000);
  const [capitalLosses, setCapitalLosses] = useState<number>(2000);
  const [calculation, setCalculation] = useState<ATOTaxCalculation | null>(null);
  const [financialYear, setFinancialYear] = useState<string>('2023-24');

  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0, bracket: 'Tax-free threshold' },
    { min: 18201, max: 45000, rate: 19, bracket: '$18,201 - $45,000' },
    { min: 45001, max: 120000, rate: 32.5, bracket: '$45,001 - $120,000' },
    { min: 120001, max: 180000, rate: 37, bracket: '$120,001 - $180,000' },
    { min: 180001, max: Infinity, rate: 45, bracket: '$180,001+' }
  ];

  const calculateTax = () => {
    const netCapitalGain = Math.max(0, capitalGains - capitalLosses);
    const discountedGain = netCapitalGain * 0.5; // 50% CGT discount for assets held > 12 months
    const totalTaxableIncome = taxableIncome + discountedGain;

    // Find applicable tax bracket
    const bracket = taxBrackets.find(b => totalTaxableIncome >= b.min && totalTaxableIncome <= b.max);

    // Calculate tax
    let tax = 0;
    let remainingIncome = totalTaxableIncome;

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break;
      
      const taxableAtThisBracket = Math.min(
        remainingIncome,
        bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min + 1
      );
      
      if (taxableAtThisBracket > 0 && totalTaxableIncome > bracket.min) {
        tax += taxableAtThisBracket * (bracket.rate / 100);
        remainingIncome -= taxableAtThisBracket;
      }
    }

    const medicareLevy = totalTaxableIncome * 0.02; // 2% Medicare Levy
    const totalTax = tax + medicareLevy;
    const effectiveTaxRate = (totalTax / totalTaxableIncome) * 100;

    const result: ATOTaxCalculation = {
      year: parseInt(financialYear.split('-')[0]),
      totalGains: capitalGains,
      totalLosses: capitalLosses,
      netCapitalGain: netCapitalGain,
      taxableAmount: discountedGain,
      events: [],
      gains: capitalGains,
      losses: capitalLosses,
      netPosition: netCapitalGain,
      taxOwed: totalTax,
      effectiveTaxRate: effectiveTaxRate,
      financialYear: financialYear,
      taxableIncome: totalTaxableIncome,
      CGTDiscount: 50,
      netCapitalGains: discountedGain,
      incomeTax: tax,
      medicareLevy: medicareLevy,
      totalTaxLiability: totalTax,
      taxWithheld: 0,
      taxRefundOrOwed: totalTax,
      transactions: [
        {
          date: '2024-01-15',
          asset: 'Bitcoin',
          quantity: 1.0,
          costBase: 45000,
          proceedsAmount: 55000,
          gainLoss: 10000,
          isShortTerm: false
        }
      ],
      bracketInfo: bracket
    };

    setCalculation(result);
  };

  useEffect(() => {
    calculateTax();
  }, [taxableIncome, capitalGains, capitalLosses, financialYear]);

  const downloadReport = () => {
    console.log('Downloading tax report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ATO Tax Calculator</h2>
          <p className="text-muted-foreground">
            Calculate your Australian cryptocurrency tax obligations
          </p>
        </div>
        <Button onClick={downloadReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Inputs
            </CardTitle>
            <CardDescription>
              Enter your income and trading details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Select value={financialYear} onValueChange={setFinancialYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2022-23">2022-23</SelectItem>
                  <SelectItem value="2021-22">2021-22</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxableIncome">Taxable Income (excluding crypto)</Label>
              <Input
                id="taxableIncome"
                type="number"
                value={taxableIncome}
                onChange={(e) => setTaxableIncome(Number(e.target.value))}
                placeholder="75000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capitalGains">Total Capital Gains</Label>
              <Input
                id="capitalGains"
                type="number"
                value={capitalGains}
                onChange={(e) => setCapitalGains(Number(e.target.value))}
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capitalLosses">Total Capital Losses</Label>
              <Input
                id="capitalLosses"
                type="number"
                value={capitalLosses}
                onChange={(e) => setCapitalLosses(Number(e.target.value))}
                placeholder="2000"
              />
            </div>

            <Button onClick={calculateTax} className="w-full">
              Recalculate Tax
            </Button>
          </CardContent>
        </Card>

        {calculation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tax Calculation
              </CardTitle>
              <CardDescription>
                Your estimated tax liability for {calculation.financialYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Net Capital Gain</p>
                  <p className="text-lg font-semibold">${calculation.netCapitalGain.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CGT Discount (50%)</p>
                  <p className="text-lg font-semibold">${calculation.taxableAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Income Tax</p>
                  <p className="text-lg font-semibold">${calculation.incomeTax?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medicare Levy</p>
                  <p className="text-lg font-semibold">${calculation.medicareLevy?.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Tax Owed:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${calculation.taxOwed?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Effective Tax Rate:</span>
                  <span className="text-sm">{calculation.effectiveTaxRate?.toFixed(2)}%</span>
                </div>
              </div>

              {calculation.bracketInfo && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Tax Bracket</p>
                  <p className="text-sm text-muted-foreground">{calculation.bracketInfo.bracket}</p>
                  <p className="text-sm text-muted-foreground">Rate: {calculation.bracketInfo.rate}%</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Australian Tax Brackets {financialYear}</CardTitle>
          <CardDescription>
            Current income tax rates for Australian residents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income Range</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Tax on Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxBrackets.map((bracket, index) => (
                <TableRow key={index}>
                  <TableCell>{bracket.bracket}</TableCell>
                  <TableCell>
                    <Badge variant={bracket.rate === 0 ? 'secondary' : 'default'}>
                      {bracket.rate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bracket.rate === 0 ? 'Nil' : `${bracket.rate}c for each $1`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATOTaxCalculator;
