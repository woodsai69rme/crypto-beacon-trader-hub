import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ATOTaxRate, ATOTaxCalculation } from "@/types/trading";

const ATOTaxCalculator: React.FC = () => {
  const [taxRates, setTaxRates] = useState<ATOTaxRate[]>([
    { year: 2023, minIncome: 0, maxIncome: 18200, baseAmount: 0, marginRate: 0 },
    { year: 2023, minIncome: 18201, maxIncome: 45000, baseAmount: 0, marginRate: 0.19 },
    { year: 2023, minIncome: 45001, maxIncome: 120000, baseAmount: 5092, marginRate: 0.325 },
    { year: 2023, minIncome: 120001, maxIncome: 180000, baseAmount: 29467, marginRate: 0.37 },
    { year: 2023, minIncome: 180001, maxIncome: null, baseAmount: 51667, marginRate: 0.45 }
  ]);
  
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [capitalGains, setCapitalGains] = useState<number>(0);
  const [cgtDiscount, setCGTDiscount] = useState<number>(0);
  const [taxWithheld, setTaxWithheld] = useState<number>(0);
  const [medicareLevyRate, setMedicareLevyRate] = useState<number>(0.02);
  
  const calculateTax = () => {
    const taxableIncome = totalIncome - deductions;
    
    // Find the applicable tax bracket
    const applicableBracket = taxRates.find(bracket => {
      return taxableIncome >= bracket.minIncome && (bracket.maxIncome === null || taxableIncome <= bracket.maxIncome);
    });
    
    if (!applicableBracket) {
      return null;
    }
    
    // Calculate tax payable
    const calculatedTax = applicableBracket.baseAmount + ((taxableIncome - applicableBracket.minIncome) * applicableBracket.marginRate);
    
    // Calculate Medicare Levy
    const medicareLevy = taxableIncome * medicareLevyRate;
    
    // Calculate final tax amount
    const finalTaxAmount = calculatedTax + medicareLevy - taxWithheld;
    
    // Calculate effective tax rate
    const effectiveTaxRate = (calculatedTax / totalIncome) * 100;
    
    const result: ATOTaxCalculation = {
      year: 2023,
      financialYear: "2022-2023", // Using correct property name
      assessableIncome: totalIncome,
      taxableIncome: taxableIncome, // Using correct property
      taxBracket: applicableBracket,
      taxPayable: calculatedTax,
      medicareLevyPayable: medicareLevy, // Using correct property
      taxWithheld: taxWithheld,
      taxRefundOrOwed: finalTaxAmount,
      capitalGains: capitalGains,
      CGTDiscount: cgtDiscount,
      deductions: deductions,
      effectiveTaxRate: effectiveTaxRate
    };
    
    return result;
  };
  
  const taxResult = calculateTax();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATO Tax Calculator</CardTitle>
        <CardDescription>Estimate your Australian income tax obligations</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="total-income">Total Assessable Income ($)</Label>
          <Input
            type="number"
            id="total-income"
            placeholder="Enter total income"
            value={totalIncome.toString()}
            onChange={(e) => setTotalIncome(Number(e.target.value))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="deductions">Total Deductions ($)</Label>
          <Input
            type="number"
            id="deductions"
            placeholder="Enter total deductions"
            value={deductions.toString()}
            onChange={(e) => setDeductions(Number(e.target.value))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="capital-gains">Capital Gains ($)</Label>
          <Input
            type="number"
            id="capital-gains"
            placeholder="Enter capital gains"
            value={capitalGains.toString()}
            onChange={(e) => setCapitalGains(Number(e.target.value))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="cgt-discount">CGT Discount ($)</Label>
          <Input
            type="number"
            id="cgt-discount"
            placeholder="Enter CGT discount"
            value={cgtDiscount.toString()}
            onChange={(e) => setCGTDiscount(Number(e.target.value))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="tax-withheld">Tax Withheld ($)</Label>
          <Input
            type="number"
            id="tax-withheld"
            placeholder="Enter tax withheld"
            value={taxWithheld.toString()}
            onChange={(e) => setTaxWithheld(Number(e.target.value))}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="medicare-levy-rate">Medicare Levy Rate (%)</Label>
          <Input
            type="number"
            id="medicare-levy-rate"
            placeholder="Enter medicare levy rate"
            value={(medicareLevyRate * 100).toString()}
            onChange={(e) => setMedicareLevyRate(Number(e.target.value) / 100)}
          />
        </div>
      </CardContent>
      
      {taxResult && (
        <CardContent className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Tax Estimate</h3>
          <div className="grid gap-2">
            <div>
              <Label>Financial Year</Label>
              <p>{taxResult.financialYear}</p>
            </div>
            <div>
              <Label>Assessable Income</Label>
              <p>${taxResult.assessableIncome.toFixed(2)}</p>
            </div>
            <div>
              <Label>Taxable Income</Label>
              <p>${taxResult.taxableIncome.toFixed(2)}</p>
            </div>
            <div>
              <Label>Tax Payable</Label>
              <p>${taxResult.taxPayable.toFixed(2)}</p>
            </div>
            <div>
              <Label>Medicare Levy Payable</Label>
              <p>${taxResult.medicareLevyPayable.toFixed(2)}</p>
            </div>
            <div>
              <Label>Tax Withheld</Label>
              <p>${taxResult.taxWithheld.toFixed(2)}</p>
            </div>
            <div>
              <Label>Tax Refund / Owed</Label>
              <p>${taxResult.taxRefundOrOwed.toFixed(2)}</p>
            </div>
            <div>
              <Label>Effective Tax Rate</Label>
              <p>{taxResult.effectiveTaxRate.toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      )}
      
      {!taxResult && totalIncome > 0 && (
        <CardContent className="mt-4">
          <p className="text-muted-foreground">Could not calculate tax estimate. Please check your inputs.</p>
        </CardContent>
      )}
    </Card>
  );
};

export default ATOTaxCalculator;
