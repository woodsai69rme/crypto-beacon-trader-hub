
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownUp, Download, CircleDollarSign } from 'lucide-react';

interface TaxPosition {
  id: string;
  symbol: string;
  purchaseDate: string;
  purchasePrice: number;
  quantity: number;
  currentPrice: number;
  unrealizedGainLoss: number;
}

export const TaxHarvestingTool: React.FC = () => {
  const [taxYear, setTaxYear] = useState<string>("2023");
  const [positions, setPositions] = useState<TaxPosition[]>([
    {
      id: "1",
      symbol: "BTC",
      purchaseDate: "2023-01-15",
      purchasePrice: 20000,
      quantity: 0.5,
      currentPrice: 18000,
      unrealizedGainLoss: -1000
    },
    {
      id: "2",
      symbol: "ETH",
      purchaseDate: "2023-03-10",
      purchasePrice: 1500,
      quantity: 3,
      currentPrice: 1200,
      unrealizedGainLoss: -900
    },
    {
      id: "3",
      symbol: "SOL",
      purchaseDate: "2023-02-22",
      purchasePrice: 80,
      quantity: 15,
      currentPrice: 55,
      unrealizedGainLoss: -375
    },
    {
      id: "4",
      symbol: "ADA",
      purchaseDate: "2023-05-05",
      purchasePrice: 0.5,
      quantity: 1000,
      currentPrice: 0.32,
      unrealizedGainLoss: -180
    }
  ]);
  
  const totalHarvestableAmount = positions
    .filter(pos => pos.unrealizedGainLoss < 0)
    .reduce((sum, pos) => sum + Math.abs(pos.unrealizedGainLoss), 0);
  
  const handleHarvestPosition = (id: string) => {
    // In a real app, this would execute a sell transaction
    // For demo purposes, we just log it
    const position = positions.find(p => p.id === id);
    console.log(`Harvesting tax loss for ${position?.symbol}:`, position);
    
    // Update the position list (in reality, this would be after transaction confirmation)
    setPositions(positions.map(p => 
      p.id === id 
        ? { ...p, unrealizedGainLoss: 0, purchasePrice: p.currentPrice, purchaseDate: new Date().toISOString().split('T')[0] }
        : p
    ));
  };
  
  const downloadReport = () => {
    // Creating CSV content
    const csvContent = [
      "Symbol,Purchase Date,Purchase Price,Quantity,Current Price,Unrealized Gain/Loss",
      ...positions.map(p => 
        `${p.symbol},${p.purchaseDate},${p.purchasePrice},${p.quantity},${p.currentPrice},${p.unrealizedGainLoss}`
      )
    ].join("\n");
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `tax_harvest_opportunities_${taxYear}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="tax-year">Tax Year</Label>
          <Select value={taxYear} onValueChange={setTaxYear}>
            <SelectTrigger id="tax-year" className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Harvestable Tax Loss</h3>
          <div className="text-2xl font-bold flex items-center">
            <CircleDollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
            ${totalHarvestableAmount.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Total potential tax loss that can be harvested in {taxYear}
        </p>
      </div>
      
      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead className="text-right">Unrealized P/L</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">
                    {position.symbol} <span className="text-xs text-muted-foreground">({position.quantity})</span>
                  </TableCell>
                  <TableCell>{position.purchaseDate}</TableCell>
                  <TableCell>${position.purchasePrice.toFixed(2)}</TableCell>
                  <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${position.unrealizedGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${position.unrealizedGainLoss.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {position.unrealizedGainLoss < 0 && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleHarvestPosition(position.id)}
                        className="flex items-center gap-1"
                      >
                        <ArrowDownUp className="h-4 w-4" />
                        Harvest
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">About Tax Loss Harvesting</h4>
        <p className="text-sm text-muted-foreground">
          Tax loss harvesting is the practice of selling assets at a loss to offset capital gains tax liability. 
          This tool identifies cryptocurrency assets that can be sold at a loss to reduce your tax burden.
          Always consult with a tax professional before making tax-related decisions.
        </p>
      </div>
    </div>
  );
};
