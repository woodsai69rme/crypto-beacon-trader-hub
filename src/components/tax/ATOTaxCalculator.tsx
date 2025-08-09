
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ATOTaxCalculation, TaxBracket } from '@/types/trading';

const ATOTaxCalculator: React.FC = () => {
  const [calculation, setCalculation] = useState<ATOTaxCalculation>({
    capitalGains: 50000,
    taxableIncome: 85000,
    totalTax: 18500,
    netGain: 45000,
    marginalRate: 0.32,
    medicareLevy: 1700,
    applicableBracket: '$45,001 - $120,000',
    // Required fields from interface
    totalGain: 50000,
    totalLoss: 5000,
    taxOwed: 18500,
    events: [],
    year: 2024,
    gains: 50000,
    losses: 5000,
    netPosition: 45000,
    financialYear: '2023-24',
    bracket: {
      min: 45001,
      max: 120000,
      rate: 0.32,
      name: 'Middle Tax Bracket'
    } as TaxBracket,
    CGTDiscount: 25000,
    effectiveTaxRate: 0.32,
    taxRefundOrOwed: 0,
    transactions: []
  });

  const handleCalculate = () => {
    const newCalculation: ATOTaxCalculation = {
      capitalGains: 50000,
      taxableIncome: 85000,
      totalTax: 18500,
      netGain: 45000,
      marginalRate: 0.32,
      medicareLevy: 1700,
      applicableBracket: '$45,001 - $120,000',
      // Required fields
      totalGain: 50000,
      totalLoss: 5000,
      taxOwed: 18500,
      events: [],
      year: 2024,
      gains: 50000,
      losses: 5000,
      netPosition: 45000,
      financialYear: '2023-24',
      bracket: {
        min: 45001,
        max: 120000,
        rate: 0.32,
        name: 'Middle Tax Bracket'
      } as TaxBracket,
      CGTDiscount: 25000,
      effectiveTaxRate: 0.32,
      taxRefundOrOwed: 0,
      transactions: []
    };
    
    setCalculation(newCalculation);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATO Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Capital Gains</label>
              <div className="text-xl font-bold text-green-600">
                AUD {calculation.capitalGains.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax Owed</label>
              <div className="text-xl font-bold text-red-600">
                AUD {calculation.totalTax.toLocaleString()}
              </div>
            </div>
          </div>
          
          <Button onClick={handleCalculate} className="w-full">
            Calculate Tax
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
