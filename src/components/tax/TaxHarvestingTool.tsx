import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, XCircle } from "lucide-react";
import { CoinOption, Trade } from "@/types/trading";

// Use a different name for the local interface to avoid conflict
interface TaxHarvestTradeItem extends Trade {
  tags?: string[];
}

const TaxHarvestingTool: React.FC = () => {
  const [trades, setTrades] = useState<TaxHarvestTradeItem[]>([
    {
      id: "1",
      coinId: "bitcoin",
      coinSymbol: "BTC",
      type: "buy",
      amount: 0.5,
      price: 42000,
      total: 21000,
      totalValue: 21000,
      coinName: "Bitcoin",
      timestamp: "2023-01-15T00:00:00Z",
      currency: "USD",
      currentValue: 30000,
      profitLoss: 9000,
      tags: ["long-term"]
    },
    {
      id: "2",
      coinId: "ethereum",
      coinSymbol: "ETH",
      type: "buy",
      amount: 5,
      price: 2800,
      total: 14000,
      totalValue: 14000,
      coinName: "Ethereum",
      timestamp: "2023-02-10T00:00:00Z",
      currency: "USD",
      currentValue: 15000,
      profitLoss: 1000,
      tags: ["long-term"]
    },
    {
      id: "3",
      coinId: "solana",
      coinSymbol: "SOL",
      type: "buy",
      amount: 50,
      price: 120,
      total: 6000,
      totalValue: 6000,
      coinName: "Solana",
      timestamp: "2023-06-20T00:00:00Z",
      currency: "USD",
      currentValue: 5500,
      profitLoss: -500,
      tags: ["short-term", "harvest-candidate"]
    },
    {
      id: "4",
      coinId: "cardano",
      coinSymbol: "ADA",
      type: "buy",
      amount: 2000,
      price: 0.55,
      total: 1100,
      totalValue: 1100,
      coinName: "Cardano",
      timestamp: "2023-08-05T00:00:00Z",
      currency: "USD",
      currentValue: 900,
      profitLoss: -200,
      tags: ["short-term", "harvest-candidate"]
    }
  ]);
  
  const [harvestingYear, setHarvestingYear] = useState<string>("2023");
  const [harvestThreshold, setHarvestThreshold] = useState<number>(1000);
  
  // Fix the coinOptions array with missing properties
  const coinOptions: CoinOption[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 55000,
      priceChange: 1200,
      changePercent: 2.3,
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    {
      id: "ethereum",
      name: "Ethereum", 
      symbol: "ETH",
      price: 2650,
      priceChange: 75,
      changePercent: 2.9,
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 118,
      priceChange: 3.5,
      changePercent: 3.1,
      value: "solana",
      label: "Solana (SOL)"
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange: 0.02,
      changePercent: 4.7,
      value: "cardano",
      label: "Cardano (ADA)"
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.58,
      priceChange: -0.01,
      changePercent: -1.5,
      value: "ripple",
      label: "Ripple (XRP)"
    }
  ];
  
  const addMockTrade = () => {
    const randomCoin = coinOptions[Math.floor(Math.random() * coinOptions.length)];
    const isBuy = Math.random() > 0.3;
    const amount = parseFloat((Math.random() * 10).toFixed(2));
    const priceVariation = (Math.random() * 0.2) - 0.1; // -10% to +10%
    const price = randomCoin.price * (1 + priceVariation);
    const totalValue = price * amount;
    
    // Random date in the past year
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const currentValueVariation = (Math.random() * 0.4) - 0.2; // -20% to +20%
    const currentValue = totalValue * (1 + currentValueVariation);
    const profitLoss = currentValue - totalValue;
    
    // Determine if it's a short or long term hold
    const isLongTerm = daysAgo > 365;
    const isHarvestCandidate = profitLoss < -harvestThreshold / 10;
    
    const tags: string[] = [];
    if (isLongTerm) {
      tags.push("long-term");
    } else {
      tags.push("short-term");
    }
    
    if (isHarvestCandidate) {
      tags.push("harvest-candidate");
    }
    
    const newTrade: TaxHarvestTradeItem = {
      id: Date.now().toString(),
      coinId: randomCoin.id,
      coinName: randomCoin.name,
      coinSymbol: randomCoin.symbol,
      type: isBuy ? 'buy' : 'sell',
      amount,
      price,
      total: totalValue,
      totalValue,
      timestamp: date.toISOString(),
      currency: "USD",
      currentValue,
      profitLoss,
      tags
    };
    
    setTrades([...trades, newTrade]);
  };
  
  // Filter for harvest candidates
  const harvestCandidates = trades.filter(
    trade => trade.profitLoss < 0 && 
            trade.tags?.includes("harvest-candidate")
  );
  
  // Calculate potential tax savings
  const potentialSavings = harvestCandidates.reduce(
    (total, trade) => total + Math.abs(trade.profitLoss) * 0.15, // Assuming 15% tax rate
    0
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax-Loss Harvesting Tool</CardTitle>
        <CardDescription>
          Identify opportunities to harvest losses for tax benefits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <span className="block text-sm font-medium mb-1">Tax Year</span>
            <Select value={harvestingYear} onValueChange={setHarvestingYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <span className="block text-sm font-medium mb-1">Harvesting Threshold</span>
            <Input 
              type="number"
              value={harvestThreshold}
              onChange={(e) => setHarvestThreshold(Number(e.target.value))}
              placeholder="Minimum loss to harvest"
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={addMockTrade} className="w-full">
              Add Mock Trade
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Harvesting Opportunities</h3>
            <div className="bg-muted rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Potential Tax Savings</span>
                  <p className="text-2xl font-bold">${potentialSavings.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Opportunities</span>
                  <p className="text-2xl font-bold">{harvestCandidates.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Harvest Candidates</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Value</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead className="text-right">Unrealized Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {harvestCandidates.length > 0 ? (
                    harvestCandidates.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          {trade.coinName} ({trade.coinSymbol})
                        </TableCell>
                        <TableCell>
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ${trade.totalValue.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${trade.currentValue?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-red-500 font-medium">
                          ${Math.abs(trade.profitLoss).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <div className="flex flex-col items-center text-muted-foreground">
                          <XCircle className="h-6 w-6 mb-1" />
                          <span>No harvesting opportunities found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">All Positions</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>P/L</TableHead>
                    <TableHead>Term</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {trade.coinSymbol}
                      </TableCell>
                      <TableCell>
                        <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                          {trade.type.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {trade.amount} @ ${trade.price.toFixed(2)}
                      </TableCell>
                      <TableCell className={
                        trade.profitLoss > 0
                          ? 'text-green-500'
                          : trade.profitLoss < 0
                          ? 'text-red-500'
                          : ''
                      }>
                        {trade.profitLoss > 0 && '+'}
                        ${trade.profitLoss.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {trade.tags?.includes('long-term') ? 'Long' : 'Short'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxHarvestingTool;
