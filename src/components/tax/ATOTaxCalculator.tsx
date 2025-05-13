
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calculator, Save, Download } from "lucide-react";

interface TaxCalculationResult {
  financialYear: string;
  taxableIncome: number;
  CGTDiscount: number;
  netCapitalGains: number;
  bracketInfo: string;
  incomeTax: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
}

export const ATOTaxCalculator = () => {
  const [formData, setFormData] = useState({
    financialYear: "2023-2024",
    taxableIncome: 85000,
    capitalGains: 15000,
    capitalLosses: 5000,
    assetHeldOver12Months: true,
    taxWithheld: 22000,
  });

  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const calculateTax = () => {
    // This is a simplified tax calculation for Australia
    // In a real app, this would be much more complex and accurate
    
    // Calculate net capital gains
    let netCapitalGains = formData.capitalGains - formData.capitalLosses;
    
    // Apply CGT discount if assets held for more than 12 months
    const CGTDiscount = formData.assetHeldOver12Months ? netCapitalGains * 0.5 : 0;
    netCapitalGains = formData.assetHeldOver12Months ? netCapitalGains * 0.5 : netCapitalGains;
    
    // Add capital gains to taxable income
    const totalTaxableIncome = formData.taxableIncome + netCapitalGains;
    
    // Calculate income tax based on 2023-2024 tax brackets
    let incomeTax = 0;
    let bracketInfo = "";
    
    if (totalTaxableIncome <= 18200) {
      incomeTax = 0;
      bracketInfo = "0% - Tax Free Threshold";
    } else if (totalTaxableIncome <= 45000) {
      incomeTax = (totalTaxableIncome - 18200) * 0.19;
      bracketInfo = "19% on income above $18,200";
    } else if (totalTaxableIncome <= 120000) {
      incomeTax = 5092 + (totalTaxableIncome - 45000) * 0.325;
      bracketInfo = "32.5% on income above $45,000";
    } else if (totalTaxableIncome <= 180000) {
      incomeTax = 29467 + (totalTaxableIncome - 120000) * 0.37;
      bracketInfo = "37% on income above $120,000";
    } else {
      incomeTax = 51667 + (totalTaxableIncome - 180000) * 0.45;
      bracketInfo = "45% on income above $180,000";
    }
    
    // Calculate Medicare levy (2% of taxable income)
    const medicareLevy = totalTaxableIncome * 0.02;
    
    // Calculate total tax liability
    const totalTaxLiability = incomeTax + medicareLevy;
    
    // Calculate tax refund or amount owed
    const taxRefundOrOwed = formData.taxWithheld - totalTaxLiability;
    
    setResult({
      financialYear: formData.financialYear,
      taxableIncome: formData.taxableIncome,
      CGTDiscount,
      netCapitalGains,
      bracketInfo,
      incomeTax,
      medicareLevy,
      totalTaxLiability,
      taxWithheld: formData.taxWithheld,
      taxRefundOrOwed
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            ATO Crypto Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate your Australian cryptocurrency tax obligations based on ATO guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="simple">Simple Calculation</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="financial-year">Financial Year</Label>
                    <Select 
                      value={formData.financialYear} 
                      onValueChange={(value) => handleChange("financialYear", value)}
                    >
                      <SelectTrigger id="financial-year">
                        <SelectValue placeholder="Select financial year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2022-2023">2022-2023</SelectItem>
                        <SelectItem value="2021-2022">2021-2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="taxable-income">Taxable Income ($)</Label>
                    <Input
                      id="taxable-income"
                      type="number"
                      value={formData.taxableIncome}
                      onChange={(e) => handleChange("taxableIncome", Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="capital-gains">Capital Gains ($)</Label>
                    <Input
                      id="capital-gains"
                      type="number"
                      value={formData.capitalGains}
                      onChange={(e) => handleChange("capitalGains", Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="capital-losses">Capital Losses ($)</Label>
                    <Input
                      id="capital-losses"
                      type="number"
                      value={formData.capitalLosses}
                      onChange={(e) => handleChange("capitalLosses", Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="tax-withheld">Tax Withheld ($)</Label>
                    <Input
                      id="tax-withheld"
                      type="number"
                      value={formData.taxWithheld}
                      onChange={(e) => handleChange("taxWithheld", Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="asset-held"
                      checked={formData.assetHeldOver12Months}
                      onChange={(e) => handleChange("assetHeldOver12Months", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="asset-held" className="font-normal cursor-pointer">
                      Assets held for more than 12 months (50% CGT discount)
                    </Label>
                  </div>
                </div>
                
                <Button onClick={calculateTax} className="w-full">
                  Calculate Tax
                </Button>

                {result && (
                  <div className="mt-6 p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Tax Calculation Results ({result.financialYear})
                      </h3>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span className="font-medium">{formatCurrency(result.taxableIncome)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Net Capital Gains:</span>
                        <span className="font-medium">{formatCurrency(result.netCapitalGains)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>CGT Discount Applied:</span>
                        <span className="font-medium">{formatCurrency(result.CGTDiscount)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax Bracket:</span>
                        <span>{result.bracketInfo}</span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between">
                        <span>Income Tax:</span>
                        <span className="font-medium">{formatCurrency(result.incomeTax)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Medicare Levy:</span>
                        <span className="font-medium">{formatCurrency(result.medicareLevy)}</span>
                      </div>
                      
                      <div className="flex justify-between font-medium">
                        <span>Total Tax Liability:</span>
                        <span>{formatCurrency(result.totalTaxLiability)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Tax Withheld:</span>
                        <span className="font-medium">{formatCurrency(result.taxWithheld)}</span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>{result.taxRefundOrOwed >= 0 ? "Tax Refund:" : "Tax Owed:"}</span>
                        <span className={result.taxRefundOrOwed >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(Math.abs(result.taxRefundOrOwed))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="detailed">
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">Detailed Analysis Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Our detailed cryptocurrency tax analysis tools are currently being developed. 
                  This will include trade-by-trade calculations, FIFO/LIFO methods, 
                  and automatic transaction imports.
                </p>
                <Button variant="outline" className="mt-4">Join Waitlist</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>ATO Cryptocurrency Tax Guidelines</CardTitle>
          <CardDescription>
            Key points from the Australian Taxation Office guidelines for cryptocurrency taxation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Capital Gains Tax (CGT)</h3>
            <p className="text-sm text-muted-foreground">
              When you dispose of cryptocurrency, you make a capital gain or capital loss. 
              This is the difference between your cost base (what you paid for the cryptocurrency, 
              including purchase costs) and your capital proceeds (what you received when you disposed of it, 
              minus any fees).
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">CGT Discount</h3>
            <p className="text-sm text-muted-foreground">
              If you hold your cryptocurrency for more than 12 months before disposing of it, 
              you may be eligible for a 50% CGT discount. This means only half of your capital gain 
              is subject to tax.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Record Keeping</h3>
            <p className="text-sm text-muted-foreground">
              You need to keep records of all cryptocurrency transactions, including:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
              <li>Dates of transactions</li>
              <li>Value of cryptocurrency in AUD at the time of the transaction</li>
              <li>Purpose of the transaction</li>
              <li>Details of the other party (even if it's just their wallet address)</li>
              <li>Transaction costs</li>
            </ul>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <span className="font-medium">Disclaimer:</span> This calculator provides an estimate only and 
              should not be considered as tax advice. Please consult with a registered tax professional 
              for advice specific to your situation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATOTaxCalculator;
