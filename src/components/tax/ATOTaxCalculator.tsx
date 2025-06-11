
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ATOTaxCalculation, TaxBracket } from '@/types/trading';
import { Calculator, DollarSign } from 'lucide-react';

const ATOTaxCalculator: React.FC = () => {
  const [gains, setGains] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [calculation, setCalculation] = useState<ATOTaxCalculation>({
    capitalGains: 0,
    taxableIncome: 0,
    totalTax: 0,
    netGain: 0,
    marginalRate: 0,
    medicareLevy: 0,
    applicableBracket: '',
  });

  // 2024-25 Australian Tax Brackets
  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0, name: 'Tax-free threshold', bracket: '$0 – $18,200' },
    { min: 18201, max: 45000, rate: 0.19, name: 'Low income', bracket: '$18,201 – $45,000' },
    { min: 45001, max: 120000, rate: 0.325, name: 'Middle income', bracket: '$45,001 – $120,000' },
    { min: 120001, max: 180000, rate: 0.37, name: 'High income', bracket: '$120,001 – $180,000' },
    { min: 180001, max: Infinity, rate: 0.45, name: 'Top income', bracket: '$180,001+' }
  ];

  const calculateTax = () => {
    const totalIncome = income + gains;
    let tax = 0;
    let bracket = '';
    let marginalRate = 0;

    // Find applicable bracket and calculate tax
    for (const taxBracket of taxBrackets) {
      if (totalIncome > taxBracket.max) {
        tax += (taxBracket.max - taxBracket.min + 1) * taxBracket.rate;
      } else if (totalIncome > taxBracket.min) {
        tax += (totalIncome - taxBracket.min) * taxBracket.rate;
        bracket = taxBracket.bracket || '';
        marginalRate = taxBracket.rate;
        break;
      }
    }

    const medicareLevy = totalIncome > 23226 ? totalIncome * 0.02 : 0;
    const totalTax = tax + medicareLevy;
    const netGain = gains - (totalTax - (income > 0 ? income * marginalRate : 0));

    setCalculation({
      capitalGains: gains,
      taxableIncome: totalIncome,
      totalTax,
      netGain,
      marginalRate,
      medicareLevy,
      applicableBracket: bracket,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ATO Tax Calculator
        </CardTitle>
        <CardDescription>
          Calculate Australian tax obligations on cryptocurrency gains
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gains">Capital Gains (AUD)</Label>
            <Input
              id="gains"
              type="number"
              value={gains}
              onChange={(e) => setGains(Number(e.target.value))}
              placeholder="Enter capital gains"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Other Taxable Income (AUD)</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              placeholder="Enter other income"
            />
          </div>
        </div>

        <Button onClick={calculateTax} className="w-full">
          Calculate Tax
        </Button>

        {calculation.totalTax > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Tax</div>
              <div className="text-2xl font-bold text-red-600">
                ${calculation.totalTax.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Net Gain After Tax</div>
              <div className="text-2xl font-bold text-green-600">
                ${calculation.netGain.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Marginal Tax Rate</div>
              <div className="text-lg font-semibold">
                {(calculation.marginalRate * 100).toFixed(1)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Tax Bracket</div>
              <div className="text-sm font-medium">{calculation.applicableBracket}</div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>* This calculator provides estimates based on Australian tax law.</p>
          <p>* Consult a tax professional for accurate advice.</p>
          <p>* Includes Medicare Levy where applicable.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
