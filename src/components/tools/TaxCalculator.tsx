
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

const TaxCalculator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Tax Calculator</CardTitle>
        <CardDescription>
          Calculate your cryptocurrency tax obligations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-year">Tax Year</Label>
              <Select defaultValue="2023">
                <SelectTrigger id="tax-year">
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income (excluding crypto)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
              <Input id="income" className="pl-7" placeholder="0.00" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gains">Capital Gains from Crypto</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
              <Input id="gains" className="pl-7" placeholder="0.00" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="holding-period">Holding Period</Label>
            <Select defaultValue="long">
              <SelectTrigger id="holding-period">
                <SelectValue placeholder="Select holding period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short Term (< 1 year)</SelectItem>
                <SelectItem value="long">Long Term (> 1 year)</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Tax Estimate
          </Button>
          
          <div className="border rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Tax Estimate</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Total Tax Due:</div>
              <div className="text-sm font-medium">$0.00</div>
              <div className="text-sm text-muted-foreground">Effective Tax Rate:</div>
              <div className="text-sm font-medium">0.00%</div>
              <div className="text-sm text-muted-foreground">Marginal Tax Rate:</div>
              <div className="text-sm font-medium">0.00%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
