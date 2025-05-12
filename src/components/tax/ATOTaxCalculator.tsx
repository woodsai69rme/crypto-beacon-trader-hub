
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATOTaxRate, ATOTaxCalculation } from '@/types/trading';

// ATO Tax Rates for 2023-2024 financial year
const atoTaxRates2023: ATOTaxRate[] = [
  { minIncome: 0, maxIncome: 18200, baseAmount: 0, rate: 0, threshold: 0 },
  { minIncome: 18201, maxIncome: 45000, baseAmount: 0, rate: 0.19, threshold: 18200 },
  { minIncome: 45001, maxIncome: 120000, baseAmount: 5092, rate: 0.325, threshold: 45000 },
  { minIncome: 120001, maxIncome: 180000, baseAmount: 29467, rate: 0.37, threshold: 120000 },
  { minIncome: 180001, maxIncome: null, baseAmount: 51667, rate: 0.45, threshold: 180000 }
];

// Initial tax calculation state
const initialTaxCalculation: ATOTaxCalculation = {
  financialYear: "2023-2024",
  incomeAmount: 85000,
  taxWithheld: 20000,
  grossCapitalGains: 10000,
  capitalLosses: 2000,
  eligibleForDiscount: true,
  CGTDiscount: 0,
  netCapitalGains: 0,
  taxableIncome: 0,
  bracketInfo: "",
  incomeTax: 0,
  medicareLevy: 0,
  totalTaxLiability: 0,
  taxRefundOrOwed: 0
};

const ATOTaxCalculator: React.FC = () => {
  const [taxCalc, setTaxCalc] = useState<ATOTaxCalculation>(initialTaxCalculation);

  // Calculate tax whenever relevant inputs change
  useEffect(() => {
    calculateTax();
  }, [
    taxCalc.incomeAmount,
    taxCalc.taxWithheld,
    taxCalc.grossCapitalGains,
    taxCalc.capitalLosses,
    taxCalc.eligibleForDiscount
  ]);

  const calculateTax = () => {
    // Calculate net capital gains
    let netCapGains = Math.max(0, taxCalc.grossCapitalGains - taxCalc.capitalLosses);
    
    // Apply CGT discount if eligible (50% for individuals holding assets > 12 months)
    const CGTDiscount = taxCalc.eligibleForDiscount ? netCapGains * 0.5 : 0;
    netCapGains = netCapGains - CGTDiscount;
    
    // Calculate taxable income
    const taxableIncome = taxCalc.incomeAmount + netCapGains;
    
    // Find applicable tax bracket
    const bracket = atoTaxRates2023.find(
      rate => taxableIncome >= rate.minIncome && 
              (rate.maxIncome === null || taxableIncome <= rate.maxIncome)
    ) || atoTaxRates2023[0];
    
    // Calculate income tax
    const incomeTax = bracket.baseAmount + (bracket.rate * (taxableIncome - bracket.threshold));
    
    // Calculate Medicare Levy (2% of taxable income)
    const medicareLevy = taxableIncome * 0.02;
    
    // Calculate total tax liability
    const totalTaxLiability = incomeTax + medicareLevy;
    
    // Calculate refund/amount owed
    const taxRefundOrOwed = taxCalc.taxWithheld - totalTaxLiability;
    
    // Update state with calculated values
    setTaxCalc({
      ...taxCalc,
      financialYear: "2023-2024", 
      CGTDiscount, 
      netCapitalGains: netCapGains,
      taxableIncome,
      bracketInfo: `${bracket.rate * 100}% over $${bracket.threshold.toLocaleString()}`,
      incomeTax,
      medicareLevy,
      totalTaxLiability,
      taxRefundOrOwed
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaxCalc({
      ...taxCalc,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setTaxCalc({
      ...taxCalc,
      eligibleForDiscount: checked
    });
  };

  const resetCalculator = () => {
    setTaxCalc(initialTaxCalculation);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Australian Tax Calculator {taxCalc.financialYear}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="input">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input Details</TabsTrigger>
            <TabsTrigger value="results">Tax Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeAmount">Annual Income ($)</Label>
                  <Input
                    id="incomeAmount"
                    name="incomeAmount"
                    type="number"
                    value={taxCalc.incomeAmount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxWithheld">Tax Already Withheld ($)</Label>
                  <Input
                    id="taxWithheld"
                    name="taxWithheld"
                    type="number"
                    value={taxCalc.taxWithheld}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Capital Gains</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grossCapitalGains">Gross Capital Gains ($)</Label>
                    <Input
                      id="grossCapitalGains"
                      name="grossCapitalGains"
                      type="number"
                      value={taxCalc.grossCapitalGains}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capitalLosses">Capital Losses ($)</Label>
                    <Input
                      id="capitalLosses"
                      name="capitalLosses"
                      type="number"
                      value={taxCalc.capitalLosses}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    id="eligibleForDiscount"
                    checked={taxCalc.eligibleForDiscount}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="eligibleForDiscount" className="cursor-pointer">
                    Asset held for more than 12 months (50% CGT discount)
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={resetCalculator}>Reset</Button>
                <Button onClick={calculateTax}>Calculate</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Tax Summary for {taxCalc.financialYear}</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Taxable Income:</div>
                  <div className="font-medium text-right">${taxCalc.taxableIncome.toLocaleString()}</div>
                  
                  <div className="text-muted-foreground">Tax Bracket:</div>
                  <div className="font-medium text-right">{taxCalc.bracketInfo}</div>
                  
                  <div className="text-muted-foreground">Income Tax:</div>
                  <div className="font-medium text-right">${taxCalc.incomeTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  
                  <div className="text-muted-foreground">Medicare Levy:</div>
                  <div className="font-medium text-right">${taxCalc.medicareLevy.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  
                  <div className="text-muted-foreground">Net Capital Gains:</div>
                  <div className="font-medium text-right">${taxCalc.netCapitalGains.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  
                  <div className="text-muted-foreground">CGT Discount:</div>
                  <div className="font-medium text-right">${taxCalc.CGTDiscount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  
                  <div className="border-t col-span-2 mt-2 pt-2"></div>
                  
                  <div className="font-semibold">Total Tax Liability:</div>
                  <div className="font-bold text-right">${taxCalc.totalTaxLiability.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  
                  <div className="text-muted-foreground">Tax Already Withheld:</div>
                  <div className="font-medium text-right">${taxCalc.taxWithheld.toLocaleString()}</div>
                  
                  <div className="font-semibold">{taxCalc.taxRefundOrOwed >= 0 ? 'Tax Refund:' : 'Tax Payable:'}</div>
                  <div className={`font-bold text-right ${taxCalc.taxRefundOrOwed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(taxCalc.taxRefundOrOwed).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Note: This is a simplified tax calculation for the {taxCalc.financialYear} financial year.</p>
                <p>For exact tax calculations and professional advice, please consult a registered tax agent.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
