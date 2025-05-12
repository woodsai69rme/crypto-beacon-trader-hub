
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator } from 'lucide-react';
import { ATOTaxCalculation } from '@/types/trading';

const ATOTaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<string>('85000');
  const [capitalGains, setCapitalGains] = useState<string>('15000');
  const [taxYear, setTaxYear] = useState<string>('2023-2024');
  const [results, setResults] = useState<ATOTaxCalculation | null>(null);
  
  const calculateTax = () => {
    // This would be a call to a proper tax calculation function in production
    const mockResults: ATOTaxCalculation = {
      financialYear: taxYear,
      taxableIncome: parseFloat(income),
      capitalGainsIncome: parseFloat(capitalGains),
      taxRate: 0.325,
      medicareLevyRate: 0.02,
      taxPayable: parseFloat(income) * 0.325,
      medicareLevy: parseFloat(income) * 0.02,
      totalTaxLiability: parseFloat(income) * 0.325 + parseFloat(income) * 0.02,
      taxCredits: 0,
      taxRefundOrOwed: parseFloat(income) * 0.345,
      incomeTax: parseFloat(income) * 0.325,
      taxWithheld: 0,
      netCapitalGains: parseFloat(capitalGains) * 0.5,
      assessableIncome: parseFloat(income) + parseFloat(capitalGains) * 0.5,
      bracketInfo: {
        bracket: '$45,001 – $120,000',
        rate: '32.5c for each $1 over $45,000'
      },
      capitalGains: parseFloat(capitalGains),
      CGTDiscount: parseFloat(capitalGains) * 0.5
    };
    
    setResults(mockResults);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Australian Tax Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax-year">Tax Year</Label>
            <Select 
              value={taxYear} 
              onValueChange={setTaxYear}
            >
              <SelectTrigger id="tax-year">
                <SelectValue placeholder="Select tax year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
                <SelectItem value="2021-2022">2021-2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income (AUD)</Label>
            <Input 
              id="income" 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(e.target.value)}
              placeholder="E.g. 85000" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capital-gains">Capital Gains (AUD)</Label>
            <Input 
              id="capital-gains" 
              type="number" 
              value={capitalGains} 
              onChange={(e) => setCapitalGains(e.target.value)}
              placeholder="E.g. 15000" 
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={calculateTax}>Calculate Tax</Button>
        </div>
        
        {results && (
          <div className="pt-4 border-t">
            <h3 className="font-medium text-lg mb-4">Tax Assessment Summary</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount (AUD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Taxable Income</TableCell>
                  <TableCell className="text-right">${results.taxableIncome.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capital Gains</TableCell>
                  <TableCell className="text-right">${results.capitalGains.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CGT Discount (50%)</TableCell>
                  <TableCell className="text-right">${results.CGTDiscount.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net Capital Gains</TableCell>
                  <TableCell className="text-right">${results.netCapitalGains.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Assessable Income</TableCell>
                  <TableCell className="text-right">${results.assessableIncome.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Income Tax</TableCell>
                  <TableCell className="text-right">${results.incomeTax.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Medicare Levy</TableCell>
                  <TableCell className="text-right">${results.medicareLevy.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total Tax Liability</TableCell>
                  <TableCell className="text-right">${results.totalTaxLiability.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 border p-3 rounded-md">
              <div className="text-sm font-medium">Tax Bracket</div>
              <div className="flex justify-between items-center">
                <span>{results.bracketInfo.bracket}</span>
                <span className="text-muted-foreground">{results.bracketInfo.rate}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
