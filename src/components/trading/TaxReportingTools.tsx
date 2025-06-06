
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaxBracket, ATOTaxCalculation } from '@/types/trading';
import { Calculator, FileText, Download } from 'lucide-react';

const TaxReportingTools: React.FC = () => {
  const [capitalGain, setCapitalGain] = useState<number>(0);
  const [calculation, setCalculation] = useState<ATOTaxCalculation | null>(null);

  // 2024-25 Australian Tax Brackets
  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0, name: 'Tax-free threshold' },
    { min: 18201, max: 45000, rate: 0.19, name: '19% bracket' },
    { min: 45001, max: 120000, rate: 0.325, name: '32.5% bracket' },
    { min: 120001, max: 180000, rate: 0.37, name: '37% bracket' },
    { min: 180001, max: Infinity, rate: 0.45, name: '45% bracket' }
  ];

  const calculateTax = () => {
    if (capitalGain <= 0) return;

    const taxableIncome = capitalGain;
    let totalTax = 0;
    let marginalRate = 0;
    let applicableBracket = '';

    // Calculate tax based on brackets
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
        const taxInBracket = taxableInBracket * bracket.rate;
        totalTax += taxInBracket;
        marginalRate = bracket.rate;
        applicableBracket = bracket.name;
      }
    }

    // Medicare levy (2% for most taxpayers)
    const medicareLevy = taxableIncome * 0.02;
    totalTax += medicareLevy;

    const netGain = capitalGain - totalTax;

    setCalculation({
      capitalGains: capitalGain,
      taxableIncome: taxableIncome,
      totalTax: totalTax,
      netGain: netGain,
      marginalRate: marginalRate,
      medicareLevy: medicareLevy,
      applicableBracket: applicableBracket
    });
  };

  const generateReport = () => {
    if (!calculation) return;

    const reportData = {
      date: new Date().toLocaleDateString(),
      capitalGains: calculation.capitalGains,
      totalTax: calculation.totalTax,
      netGain: calculation.netGain,
      marginalRate: calculation.marginalRate,
      applicableBracket: calculation.applicableBracket
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "crypto-tax-report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Australian Crypto Tax Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capitalGain">Capital Gain (AUD)</Label>
            <Input
              id="capitalGain"
              type="number"
              value={capitalGain}
              onChange={(e) => setCapitalGain(Number(e.target.value))}
              placeholder="Enter your capital gain"
            />
          </div>

          <Button onClick={calculateTax} className="w-full">
            Calculate Tax
          </Button>

          {calculation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-3">Tax Calculation Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Capital Gain:</span>
                  <span className="font-medium ml-2">${calculation.capitalGains.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Tax:</span>
                  <span className="font-medium ml-2">${calculation.totalTax.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Net Gain:</span>
                  <span className="font-medium ml-2">${calculation.netGain.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Marginal Rate:</span>
                  <span className="font-medium ml-2">{(calculation.marginalRate * 100).toFixed(1)}%</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Tax Bracket:</span>
                  <span className="font-medium ml-2">{calculation.applicableBracket}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={generateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Australian Tax Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">2024-25 Tax Brackets</h4>
            <div className="space-y-2">
              {taxBrackets.map((bracket, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">
                    ${bracket.min.toLocaleString()} - {bracket.max === Infinity ? '∞' : `$${bracket.max.toLocaleString()}`}
                  </span>
                  <span className="text-sm font-medium">{(bracket.rate * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReportingTools;
