
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calculator, 
  Download, 
  Plus, 
  Minus, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpDown 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";

interface HarvestingOpportunity {
  id: string;
  assetName: string;
  symbol: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  loss: number;
  datePurchased: string;
  longTerm: boolean;
  taxBenefit: number;
}

export const TaxHarvestingTool = () => {
  const [opportunities, setOpportunities] = useState<HarvestingOpportunity[]>([
    {
      id: '1',
      assetName: 'Bitcoin',
      symbol: 'BTC',
      purchasePrice: 68000,
      currentPrice: 61000,
      quantity: 0.5,
      loss: 3500,
      datePurchased: '2023-11-15',
      longTerm: false,
      taxBenefit: 875
    },
    {
      id: '2',
      assetName: 'Ethereum',
      symbol: 'ETH',
      purchasePrice: 4200,
      currentPrice: 3600,
      quantity: 3,
      loss: 1800,
      datePurchased: '2023-08-22',
      longTerm: false,
      taxBenefit: 450
    },
    {
      id: '3',
      assetName: 'Solana',
      symbol: 'SOL',
      purchasePrice: 180,
      currentPrice: 140,
      quantity: 25,
      loss: 1000,
      datePurchased: '2022-12-10',
      longTerm: true,
      taxBenefit: 200
    }
  ]);

  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [taxRate, setTaxRate] = useState<number>(25);
  const [automaticReinvestment, setAutomaticReinvestment] = useState<boolean>(true);
  const [waitPeriod, setWaitPeriod] = useState<string>("30");

  const handleSelectOpportunity = (id: string) => {
    setSelectedOpportunities(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const calculateTotalSavings = () => {
    return opportunities
      .filter(opp => selectedOpportunities.includes(opp.id))
      .reduce((sum, opp) => sum + opp.taxBenefit, 0);
  };

  const handleHarvest = () => {
    if (selectedOpportunities.length === 0) {
      toast({
        title: "No opportunities selected",
        description: "Please select at least one tax loss harvesting opportunity",
        variant: "destructive"
      });
      return;
    }

    // Simulate harvesting process
    toast({
      title: "Tax Loss Harvesting Executed",
      description: `Successfully harvested ${selectedOpportunities.length} positions for a tax benefit of $${calculateTotalSavings().toFixed(2)}`,
    });

    // Remove the harvested opportunities
    setOpportunities(prev => 
      prev.filter(opp => !selectedOpportunities.includes(opp.id))
    );
    setSelectedOpportunities([]);
  };

  const handleRefresh = () => {
    // Simulating a refresh of opportunities
    toast({
      title: "Refreshing Opportunities",
      description: "Scanning your portfolio for new tax loss harvesting opportunities..."
    });

    // Add a new simulated opportunity
    setTimeout(() => {
      const newOpportunity = {
        id: `${Date.now()}`,
        assetName: 'Cardano',
        symbol: 'ADA',
        purchasePrice: 0.65,
        currentPrice: 0.45,
        quantity: 2000,
        loss: 400,
        datePurchased: '2023-10-05',
        longTerm: false,
        taxBenefit: 100
      };

      setOpportunities(prev => [...prev, newOpportunity]);

      toast({
        title: "Scan Complete",
        description: "Found 1 new tax loss harvesting opportunity"
      });
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Tax Loss Harvesting Tool
          </CardTitle>
          <CardDescription>
            Identify and execute tax loss harvesting opportunities to optimize your tax position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="tax-rate">Your Tax Rate (%)</Label>
              <div className="flex items-center mt-2">
                <Input 
                  id="tax-rate"
                  type="number" 
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min={0}
                  max={100}
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            <div>
              <Label htmlFor="wait-period">Wash Sale Wait Period</Label>
              <Select 
                value={waitPeriod} 
                onValueChange={setWaitPeriod}
              >
                <SelectTrigger id="wait-period" className="mt-2">
                  <SelectValue placeholder="Select wait period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center justify-between">
                <span>Automatic Reinvestment</span>
                <Switch 
                  checked={automaticReinvestment}
                  onCheckedChange={setAutomaticReinvestment}
                />
              </Label>
              <p className="text-sm text-muted-foreground mt-2">
                Automatically reinvest in similar assets after the wash sale period
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Available Opportunities</h3>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh Analysis
            </Button>
          </div>

          {opportunities.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Loss</TableHead>
                    <TableHead>Date Purchased</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Tax Benefit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedOpportunities.includes(opp.id)}
                          onChange={() => handleSelectOpportunity(opp.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {opp.assetName} ({opp.symbol})
                      </TableCell>
                      <TableCell>{formatCurrency(opp.purchasePrice)}</TableCell>
                      <TableCell className="text-red-500 flex items-center">
                        {formatCurrency(opp.currentPrice)}
                        <TrendingDown className="ml-1 h-4 w-4" />
                      </TableCell>
                      <TableCell>{opp.quantity}</TableCell>
                      <TableCell className="text-red-500">
                        {formatCurrency(opp.loss)}
                      </TableCell>
                      <TableCell>{formatDate(opp.datePurchased)}</TableCell>
                      <TableCell>
                        {opp.longTerm ? 'Long-term' : 'Short-term'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(opp.taxBenefit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md bg-muted/10">
              <TrendingDown className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Harvesting Opportunities</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no tax loss harvesting opportunities in your portfolio.
              </p>
              <Button onClick={handleRefresh} variant="outline" className="mt-4">
                Refresh Analysis
              </Button>
            </div>
          )}

          {selectedOpportunities.length > 0 && (
            <div className="mt-6 bg-muted/20 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Selected Opportunities</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOpportunities.length} positions selected for harvesting
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">Estimated Tax Benefit</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(calculateTotalSavings())}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" disabled={opportunities.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button 
              disabled={selectedOpportunities.length === 0}
              onClick={handleHarvest}
            >
              Execute Harvesting
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Loss Harvesting Guide</CardTitle>
          <CardDescription>
            Learn how to effectively use tax loss harvesting to optimize your tax position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">What is Tax Loss Harvesting?</h3>
            <p className="text-sm text-muted-foreground">
              Tax loss harvesting is the practice of selling a security that has experienced a loss in order to offset taxes on both capital gains and income. The sold security is replaced by a similar one, maintaining the optimal asset allocation and expected returns.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Key Benefits</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Reduce your tax liability by offsetting capital gains</li>
              <li>Deduct up to $3,000 from your ordinary income</li>
              <li>Carry forward additional losses to future tax years</li>
              <li>Maintain your portfolio's asset allocation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">How to Use This Tool</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Review the identified tax loss harvesting opportunities</li>
              <li>Select positions you want to harvest</li>
              <li>Choose whether to automatically reinvest after the wash sale period</li>
              <li>Execute the harvesting strategy with a single click</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxHarvestingTool;
