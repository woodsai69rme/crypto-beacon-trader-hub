
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TaxBracket, ATOTaxCalculation } from '@/types/trading';
import { Calculator, FileText, Download } from 'lucide-react';

const ATOTaxCalculator: React.FC = () => {
  const [capitalGains, setCapitalGains] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [taxResult, setTaxResult] = useState<ATOTaxCalculation | null>(null);

  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0, name: 'Tax-free threshold' },
    { min: 18201, max: 45000, rate: 0.19, name: '19% bracket' },
    { min: 45001, max: 120000, rate: 0.325, name: '32.5% bracket' },
    { min: 120001, max: 180000, rate: 0.37, name: '37% bracket' },
    { min: 180001, max: Infinity, rate: 0.45, name: '45% bracket' }
  ];

  const calculateTax = () => {
    const totalIncome = capitalGains + otherIncome;
    let tax = 0;
    let applicableBracket = '';

    for (const bracket of taxBrackets) {
      if (totalIncome > bracket.min) {
        const taxableInThisBracket = Math.min(totalIncome, bracket.max) - bracket.min + 1;
        tax += taxableInThisBracket * bracket.rate;
        if (totalIncome <= bracket.max) {
          applicableBracket = bracket.name;
          break;
        }
      }
    }

    const medicareLevy = totalIncome > 23226 ? totalIncome * 0.02 : 0;
    const totalTax = tax + medicareLevy;
    const netGain = totalIncome - totalTax;
    const marginalRate = taxBrackets.find(b => totalIncome >= b.min && totalIncome <= b.max)?.rate || 0;

    setTaxResult({
      capitalGains,
      taxableIncome: totalIncome,
      totalTax,
      netGain,
      marginalRate,
      medicareLevy,
      applicableBracket
    });
  };

  useEffect(() => {
    if (capitalGains > 0 || otherIncome > 0) {
      calculateTax();
    }
  }, [capitalGains, otherIncome]);

  const exportReport = () => {
    if (!taxResult) return;

    const report = `
ATO Tax Calculation Report
==========================

Capital Gains: $${taxResult.capitalGains.toLocaleString()}
Other Income: $${otherIncome.toLocaleString()}
Total Taxable Income: $${taxResult.taxableIncome.toLocaleString()}

Tax Breakdown:
- Income Tax: $${(taxResult.totalTax - taxResult.medicareLevy).toLocaleString()}
- Medicare Levy: $${taxResult.medicareLevy.toLocaleString()}
- Total Tax: $${taxResult.totalTax.toLocaleString()}

Net Income After Tax: $${taxResult.netGain.toLocaleString()}
Marginal Tax Rate: ${(taxResult.marginalRate * 100).toFixed(1)}%
Tax Bracket: ${taxResult.applicableBracket}

Generated: ${new Date().toLocaleDateString('en-AU')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ato-tax-calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            ATO Tax Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capitalGains">Capital Gains (AUD)</Label>
              <Input
                id="capitalGains"
                type="number"
                value={capitalGains}
                onChange={(e) => setCapitalGains(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="otherIncome">Other Income (AUD)</Label>
              <Input
                id="otherIncome"
                type="number"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <Button onClick={calculateTax} className="w-full">
            Calculate Tax
          </Button>
        </CardContent>
      </Card>

      {taxResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tax Calculation Results
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Capital Gains:</span>
                  <span className="font-medium">${taxResult.capitalGains.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Taxable Income:</span>
                  <span className="font-medium">${taxResult.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-medium">${(taxResult.totalTax - taxResult.medicareLevy).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medicare Levy:</span>
                  <span className="font-medium">${taxResult.medicareLevy.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Tax:</span>
                  <span>${taxResult.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-600">
                  <span>Net Income:</span>
                  <span>${taxResult.netGain.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marginal Rate:</span>
                  <Badge>{(taxResult.marginalRate * 100).toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tax Bracket:</span>
                  <Badge variant="outline">{taxResult.applicableBracket}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">2024-25 Tax Brackets</h4>
              <div className="space-y-1 text-sm">
                {taxBrackets.map((bracket, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{bracket.name}</span>
                    <span>{(bracket.rate * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATOTaxCalculator;
