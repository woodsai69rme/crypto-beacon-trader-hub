
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TaxCalculator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("us");
  const [incomeLevel, setIncomeLevel] = useState<string>("medium");
  const [holdingPeriod, setHoldingPeriod] = useState<string>("short");
  const [purchasePrice, setPurchasePrice] = useState<string>("1000");
  const [salePrice, setSalePrice] = useState<string>("1500");
  const [quantity, setQuantity] = useState<string>("1");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  
  const handleCalculate = () => {
    const purchase = parseFloat(purchasePrice) * parseFloat(quantity);
    const sale = parseFloat(salePrice) * parseFloat(quantity);
    const profit = sale - purchase;
    
    let taxRate = 0;
    
    // Simple tax rate determination
    if (selectedCountry === "us") {
      taxRate = holdingPeriod === "long" ? 0.15 : 0.25;
    } else if (selectedCountry === "uk") {
      taxRate = 0.20;
    } else if (selectedCountry === "au") {
      taxRate = 0.30;
    }
    
    // Adjust based on income level
    if (incomeLevel === "low") {
      taxRate -= 0.05;
    } else if (incomeLevel === "high") {
      taxRate += 0.05;
    }
    
    const tax = profit > 0 ? profit * taxRate : 0;
    setCalculatedTax(tax);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crypto Tax Calculator</CardTitle>
        <CardDescription>
          Estimate tax obligations from your crypto trading
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4">
            <div>
              <Label htmlFor="country">Tax Jurisdiction</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incomeLevel">Income Level</Label>
                <Select value={incomeLevel} onValueChange={setIncomeLevel}>
                  <SelectTrigger id="incomeLevel">
                    <SelectValue placeholder="Select income level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="holdingPeriod">Holding Period</Label>
                <Select value={holdingPeriod} onValueChange={setHoldingPeriod}>
                  <SelectTrigger id="holdingPeriod">
                    <SelectValue placeholder="Select holding period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
                    <SelectItem value="long">Long Term (&gt; 1 year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="salePrice">Sale Price (USD)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <Button className="w-full" onClick={handleCalculate}>Calculate Tax</Button>
            
            {calculatedTax !== null && (
              <div className="mt-6 p-4 border rounded-md bg-muted/40">
                <div className="flex justify-between">
                  <span>Capital Gain:</span>
                  <span className="font-medium">
                    ${((parseFloat(salePrice) - parseFloat(purchasePrice)) * parseFloat(quantity)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Estimated Tax:</span>
                  <span className="font-bold">${calculatedTax.toFixed(2)}</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rates" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">United States</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Short-term gains (held &lt; 1 year): Taxed as ordinary income (10-37%)</li>
                  <li>Long-term gains (held &gt; 1 year): 0%, 15%, or 20%, depending on income level</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">United Kingdom</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Capital Gains Tax: 10% for basic rate taxpayers, 20% for higher rate</li>
                  <li>Tax-free allowance of £12,300 per tax year</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Australia</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Personal income tax rates apply to crypto gains</li>
                  <li>50% capital gains discount if assets held for more than 12 months</li>
                </ul>
              </div>
              
              <div className="pt-4 text-xs text-muted-foreground">
                <p>This calculator provides estimates only and should not be considered tax advice. Consult with a tax professional for accurate guidance.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
