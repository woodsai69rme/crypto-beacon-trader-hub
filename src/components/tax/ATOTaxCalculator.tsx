
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATOTaxSettings, TaxCalculationInput, TaxCalculationResult } from '@/types/ATOTaxCalculation';

const ATOTaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(85000);
  const [capitalGains, setCapitalGains] = useState<number>(12000);
  const [deductions, setDeductions] = useState<number>(3500);
  const [cryptoTrades, setCryptoTrades] = useState<number>(42);
  const [financialYear, setFinancialYear] = useState<string>("2023-2024");
  
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const availableYears = Object.keys(ATOTaxCalculation);
  
  const handleCalculate = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const taxSettings = ATOTaxCalculation[financialYear as keyof typeof ATOTaxCalculation];
        const taxableIncome = income + capitalGains - deductions;
        
        // Calculate tax based on brackets
        let incomeTax = 0;
        for (const bracket of taxSettings.brackets) {
          if (taxableIncome > bracket.min) {
            const taxableAmount = bracket.max ? Math.min(taxableIncome, bracket.max) - bracket.min : taxableIncome - bracket.min;
            incomeTax += bracket.base + (taxableAmount * bracket.rate);
            
            if (bracket.max && taxableIncome <= bracket.max) break;
          }
        }
        
        // Calculate Medicare Levy
        const medicareLevy = taxableIncome > taxSettings.medicareLevyThreshold 
          ? taxableIncome * taxSettings.medicareLevyRate 
          : 0;
        
        // Calculate Medicare Levy Surcharge
        const medicareSurcharge = taxableIncome > taxSettings.medicareSurchargeThreshold 
          ? taxableIncome * taxSettings.medicareSurchargeRate 
          : 0;
        
        // Calculate low income tax offset
        let lowIncomeTaxOffset = 0;
        if (taxableIncome < taxSettings.lowIncomeTaxOffsetThreshold) {
          lowIncomeTaxOffset = taxSettings.lowIncomeTaxOffset;
        }
        
        // Calculate tax on crypto gains (rough estimate)
        const taxOnCryptoGains = capitalGains > 0 
          ? capitalGains * 0.325 // Assuming average tax rate of 32.5%
          : 0;
        
        const totalTax = incomeTax + medicareLevy + medicareSurcharge - lowIncomeTaxOffset;
        const afterTaxIncome = taxableIncome - totalTax;
        const effectiveTaxRate = totalTax / taxableIncome * 100;
        
        // Find the marginal tax rate based on income
        let marginalTaxRate = 0;
        let taxBracket = "";
        for (const bracket of taxSettings.brackets) {
          if (taxableIncome > bracket.min) {
            marginalTaxRate = bracket.rate * 100;
            const maxText = bracket.max ? `$${bracket.max.toLocaleString()}` : "and above";
            taxBracket = `$${bracket.min.toLocaleString()} - ${maxText}`;
          }
        }
        
        const taxBreakdown = {
          "Income Tax": incomeTax,
          "Medicare Levy": medicareLevy,
          "Medicare Levy Surcharge": medicareSurcharge,
          "Low Income Tax Offset": -lowIncomeTaxOffset,
        };
        
        setResult({
          taxableIncome,
          incomeTax,
          medicareLevy,
          medicareSurcharge,
          totalTax,
          effectiveTaxRate,
          afterTaxIncome,
          taxOnCryptoGains,
          marginalTaxRate,
          taxBracket,
          taxBreakdown,
        });
        
      } catch (error) {
        console.error("Error calculating tax:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Australian Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="income" className="text-sm font-medium">Annual Income (AUD)</label>
            <Input 
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="capital-gains" className="text-sm font-medium">Capital Gains (AUD)</label>
            <Input 
              id="capital-gains"
              type="number"
              value={capitalGains}
              onChange={(e) => setCapitalGains(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="deductions" className="text-sm font-medium">Deductions (AUD)</label>
            <Input 
              id="deductions"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="crypto-trades" className="text-sm font-medium">Number of Crypto Trades</label>
            <Input 
              id="crypto-trades"
              type="number"
              value={cryptoTrades}
              onChange={(e) => setCryptoTrades(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="financial-year" className="text-sm font-medium">Financial Year</label>
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleCalculate} className="w-full" disabled={isLoading}>
          {isLoading ? "Calculating..." : "Calculate Tax"}
        </Button>
        
        {result && (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="font-bold text-lg mb-2">Tax Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span className="font-medium">${result.taxableIncome.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax Bracket:</span>
                <span className="font-medium">{result.taxBracket}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Marginal Tax Rate:</span>
                <span className="font-medium">{result.marginalTaxRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Effective Tax Rate:</span>
                <span className="font-medium">{result.effectiveTaxRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Income Tax:</span>
                <span className="font-medium">${result.incomeTax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Medicare Levy:</span>
                <span className="font-medium">${result.medicareLevy.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Medicare Surcharge:</span>
                <span className="font-medium">${result.medicareSurcharge.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax on Crypto Gains:</span>
                <span className="font-medium">${result.taxOnCryptoGains.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span>Total Tax Payable:</span>
                <span>${result.totalTax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span>After-Tax Income:</span>
                <span>${result.afterTaxIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATOTaxCalculator;
