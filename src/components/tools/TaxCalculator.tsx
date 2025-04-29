
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const TaxCalculator: React.FC = () => {
  const [taxYear, setTaxYear] = useState<string>("2023");
  const [country, setCountry] = useState<string>("us");
  const [income, setIncome] = useState<string>("50000");
  const [cryptoGains, setCryptoGains] = useState<string>("10000");
  const [calculationMethod, setCalculationMethod] = useState<string>("fifo");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  
  const handleCalculate = () => {
    setCalculating(true);
    
    // Simulate tax calculation
    setTimeout(() => {
      // Simple tax calculation logic (for demo purposes)
      const incomeNum = parseFloat(income) || 0;
      const gainsNum = parseFloat(cryptoGains) || 0;
      
      let taxRate = 0;
      // Very simplified progressive tax rate example
      if (country === "us") {
        if (incomeNum <= 10000) taxRate = 0.1;
        else if (incomeNum <= 50000) taxRate = 0.15;
        else if (incomeNum <= 100000) taxRate = 0.25;
        else taxRate = 0.35;
      } else if (country === "uk") {
        if (incomeNum <= 12570) taxRate = 0;
        else if (incomeNum <= 50270) taxRate = 0.2;
        else if (incomeNum <= 150000) taxRate = 0.4;
        else taxRate = 0.45;
      } else if (country === "au") {
        if (incomeNum <= 18200) taxRate = 0;
        else if (incomeNum <= 45000) taxRate = 0.19;
        else if (incomeNum <= 120000) taxRate = 0.325;
        else taxRate = 0.37;
      }
      
      // Calculate tax on crypto gains
      const cryptoTax = gainsNum * taxRate;
      setCalculatedTax(cryptoTax);
      setCalculating(false);
    }, 1500);
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card">
        <CardTitle className="text-xl font-bold">Crypto Tax Calculator</CardTitle>
        <CardDescription>Calculate your estimated tax liability on cryptocurrency investments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Year</label>
                <Select value={taxYear} onValueChange={setTaxYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Income</label>
              <Input 
                type="number" 
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your annual income"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Crypto Capital Gains</label>
              <Input 
                type="number" 
                value={cryptoGains}
                onChange={(e) => setCryptoGains(e.target.value)}
                placeholder="Enter your crypto gains"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Calculation Method</label>
                <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fifo">First In, First Out (FIFO)</SelectItem>
                    <SelectItem value="lifo">Last In, First Out (LIFO)</SelectItem>
                    <SelectItem value="hifo">Highest In, First Out (HIFO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Holding Period</label>
                <Select defaultValue="mixed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
                    <SelectItem value="long">Long Term (&gt; 1 year)</SelectItem>
                    <SelectItem value="mixed">Mixed Periods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Trading Volume</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1-50 trades/year)</SelectItem>
                    <SelectItem value="medium">Medium (51-500 trades/year)</SelectItem>
                    <SelectItem value="high">High (500+ trades/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          onClick={handleCalculate} 
          disabled={calculating}
          className="w-full"
        >
          {calculating ? "Calculating..." : "Calculate Tax Liability"}
        </Button>
        
        {calculatedTax !== null && (
          <div className="pt-4">
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tax Liability Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/20 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Estimated Tax:</div>
                  <div className="text-2xl font-bold mt-1">${calculatedTax.toFixed(2)}</div>
                </div>
                <div className="bg-secondary/20 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Effective Rate:</div>
                  <div className="text-2xl font-bold mt-1">
                    {(calculatedTax / (parseFloat(cryptoGains) || 1) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                This is an estimate only. Please consult with a tax professional for accurate tax advice.
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <div>Tax Year: {taxYear}</div>
        <div>Last Updated: April 2023</div>
      </CardFooter>
    </Card>
  );
};

export default TaxCalculator;
