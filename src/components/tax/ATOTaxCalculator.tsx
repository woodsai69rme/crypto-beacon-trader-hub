
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";

interface TaxBracket {
  bracket: string;
  rate: string;
}

export const ATOTaxCalculator = () => {
  const [income, setIncome] = useState<number>(85000);
  const [year, setYear] = useState<string>("2023-2024");
  const [residencyStatus, setResidencyStatus] = useState<string>("resident");
  
  // Tax brackets for different years
  const taxBrackets: Record<string, TaxBracket[]> = {
    "2023-2024": [
      { bracket: "$0 - $18,200", rate: "0%" },
      { bracket: "$18,201 - $45,000", rate: "19%" },
      { bracket: "$45,001 - $120,000", rate: "32.5%" },
      { bracket: "$120,001 - $180,000", rate: "37%" },
      { bracket: "$180,001+", rate: "45%" },
    ],
    "2022-2023": [
      { bracket: "$0 - $18,200", rate: "0%" },
      { bracket: "$18,201 - $45,000", rate: "19%" },
      { bracket: "$45,001 - $120,000", rate: "32.5%" },
      { bracket: "$120,001 - $180,000", rate: "37%" },
      { bracket: "$180,001+", rate: "45%" },
    ],
    "2021-2022": [
      { bracket: "$0 - $18,200", rate: "0%" },
      { bracket: "$18,201 - $45,000", rate: "19%" },
      { bracket: "$45,001 - $120,000", rate: "32.5%" },
      { bracket: "$120,001 - $180,000", rate: "37%" },
      { bracket: "$180,001+", rate: "45%" },
    ],
  };
  
  // Calculate tax based on income and bracket
  const calculateTax = () => {
    if (residencyStatus === "non-resident") {
      if (income <= 120000) {
        return income * 0.325;
      } else if (income <= 180000) {
        return income * 0.37;
      } else {
        return income * 0.45;
      }
    } else {
      // For residents
      if (income <= 18200) {
        return 0;
      } else if (income <= 45000) {
        return (income - 18200) * 0.19;
      } else if (income <= 120000) {
        return 5092 + (income - 45000) * 0.325;
      } else if (income <= 180000) {
        return 29467 + (income - 120000) * 0.37;
      } else {
        return 51667 + (income - 180000) * 0.45;
      }
    }
  };
  
  const taxAmount = calculateTax();
  const effectiveTaxRate = (taxAmount / income) * 100;
  const netIncome = income - taxAmount;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income (AU$)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="py-4">
                <Slider
                  defaultValue={[income]}
                  min={0}
                  max={250000}
                  step={1000}
                  onValueChange={(values) => setIncome(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$250,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Financial Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2021-2022">2021-2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="residency">Residency Status</Label>
                <Select value={residencyStatus} onValueChange={setResidencyStatus}>
                  <SelectTrigger id="residency">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Australian Resident</SelectItem>
                    <SelectItem value="non-resident">Foreign Resident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground">Tax Amount</div>
                <div className="text-2xl font-bold">AU ${taxAmount.toLocaleString('en-AU', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}</div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Effective Tax Rate</div>
                <div className="text-xl font-semibold">{effectiveTaxRate.toFixed(2)}%</div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Net Income</div>
                <div className="text-xl font-semibold">AU ${netIncome.toLocaleString('en-AU', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax Brackets for {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {taxBrackets[year].map((bracket, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-md border ${
                  (residencyStatus === "resident" && (
                    (income <= 18200 && index === 0) ||
                    (income > 18200 && income <= 45000 && index === 1) ||
                    (income > 45000 && income <= 120000 && index === 2) ||
                    (income > 120000 && income <= 180000 && index === 3) ||
                    (income > 180000 && index === 4)
                  )) || 
                  (residencyStatus === "non-resident" && (
                    (income <= 120000 && index === 2) ||
                    (income > 120000 && income <= 180000 && index === 3) ||
                    (income > 180000 && index === 4)
                  ))
                    ? 'border-primary bg-primary/10' 
                    : ''
                }`}
              >
                <div className="text-sm">{bracket.bracket}</div>
                <div className="font-semibold">{bracket.rate}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {residencyStatus === "non-resident" 
              ? "Note: Foreign residents pay tax from the first dollar earned in Australia with no tax-free threshold" 
              : "Note: The above calculations include the tax-free threshold"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
