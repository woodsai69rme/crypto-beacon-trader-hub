
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ATOTaxCalculation, TaxBracket } from '@/types/trading';

const TaxReportingTools: React.FC = () => {
  const [taxCalculation, setTaxCalculation] = useState<ATOTaxCalculation>({
    year: 2024,
    totalTax: 15000,
    gains: 45000,
    losses: 5000,
    netPosition: 40000,
    taxOwed: 15000,
    effectiveTaxRate: 0.32,
    financialYear: '2023-24',
    taxableIncome: 80000,
    CGTDiscount: 22500,
    medicareLevy: 1600,
    marginalRate: 0.37,
    applicableBracket: '$45,001 - $120,000',
    // Required fields from ATOTaxCalculation interface
    capitalGains: 45000,
    totalGain: 45000,
    totalLoss: 5000,
    netGain: 40000,
    events: [],
    shortTermGains: 30000,
    longTermGains: 15000,
    carryForwardLosses: 0,
    discountEligible: 15000,
    assessableGain: 37500,
    effectiveRate: 0.32,
    recommendations: [
      'Consider holding assets for longer than 12 months to qualify for CGT discount',
      'Review timing of asset sales to optimize tax position'
    ],
    optimizationSuggestions: [
      'Defer some gains to next financial year',
      'Realize some losses to offset gains'
    ],
    nextYearProjection: 18000,
    transactions: [],
    bracket: {
      min: 45001,
      max: 120000,
      rate: 0.37,
      bracket: '$45,001 - $120,000'
    } as TaxBracket
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATO Tax Reporting Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Gains</label>
              <div className="text-2xl font-bold text-green-600">
                AUD {taxCalculation.gains?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Losses</label>
              <div className="text-2xl font-bold text-red-600">
                AUD {taxCalculation.losses?.toLocaleString() || '0'}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tax Owed</label>
                <div className="text-xl font-semibold">
                  AUD {taxCalculation.taxOwed.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Effective Rate</label>
                <div className="text-xl font-semibold">
                  {((taxCalculation.effectiveTaxRate || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4">
            Generate Tax Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxReportingTools;
