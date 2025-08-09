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
    taxRefundOrOwed: 0,
    medicareLevy: 1600,
    marginalRate: 0.37,
    applicableBracket: '$45,001 - $120,000',
    // Required fields from ATOTaxCalculation interface
    totalGain: 45000,
    totalLoss: 5000,
    netGain: 40000,
    events: [],
    transactions: [],
    bracket: {
      min: 45001,
      max: 120000,
      rate: 0.37,
      name: 'Middle Tax Bracket',
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
                AUD {taxCalculation.gains.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Losses</label>
              <div className="text-2xl font-bold text-red-600">
                AUD {taxCalculation.losses.toLocaleString()}
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
                  {(taxCalculation.effectiveTaxRate * 100).toFixed(1)}%
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
