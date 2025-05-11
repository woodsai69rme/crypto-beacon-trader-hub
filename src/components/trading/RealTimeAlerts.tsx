import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronsUpDown, AlertTriangle, Bell, BellOff, Calendar as CalendarIcon } from "lucide-react";
import { CoinOption } from '@/types/trading';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface AssetAlertSettings {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  alertEnabled: boolean;
  alertThreshold: number;
  lastAlerted: string | null;
}

const RealTimeAlerts: React.FC = () => {
  const [assets, setAssets] = useState<AssetAlertSettings[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 58352.12,
      priceChange: 1245.32,
      changePercent: 2.18,
      volume: 48941516789,
      marketCap: 1143349097968,
      alertEnabled: true,
      alertThreshold: 5,
      lastAlerted: null
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3105.78,
      priceChange: 65.43,
      changePercent: 2.15,
      volume: 21891456789,
      marketCap: 373952067386,
      alertEnabled: false,
      alertThreshold: 3,
      lastAlerted: null
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange: -0.01,
      changePercent: -2.17,
      volume: 467891234,
      marketCap: 15893456789,
      alertEnabled: true,
      alertThreshold: 7,
      lastAlerted: null
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 152.37,
      priceChange: 5.23,
      changePercent: 3.55,
      volume: 3578912345,
      marketCap: 67891234567,
      alertEnabled: false,
      alertThreshold: 4,
      lastAlerted: null
    }
  ]);
  
  const [coinData, setCoinData] = useState<CoinOption[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 58352.12,
      priceChange: 1245.32,
      changePercent: 2.18,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 48941516789,
      marketCap: 1143349097968,
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3105.78,
      priceChange: 65.43,
      changePercent: 2.15,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 21891456789,
      marketCap: 373952067386,
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange: -0.01,
      changePercent: -2.17,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      volume: 467891234,
      marketCap: 15893456789,
      value: "cardano",
      label: "Cardano (ADA)"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 152.37,
      priceChange: 5.23,
      changePercent: 3.55,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 3578912345,
      marketCap: 67891234567,
      value: "solana",
      label: "Solana (SOL)"
    }
  ]);
  
  const [alertFrequency, setAlertFrequency] = useState<number>(60);
  const [nextAlertCheck, setNextAlertCheck] = useState<Date>(new Date(Date.now() + alertFrequency * 1000));
  const [isGlobalAlertsEnabled, setIsGlobalAlertsEnabled] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateAssets();
      setNextAlertCheck(new Date(Date.now() + alertFrequency * 1000));
    }, alertFrequency * 1000);
    
    return () => clearInterval(intervalId);
  }, [assets, alertFrequency]);
  
  const updateAssets = () => {
    const updatedAssets = assets.map(asset => {
      const updatedCoin = coinData.find(coin => coin.id === asset.id);
      if (updatedCoin) {
        return {
          ...asset,
          price: updatedCoin.price,
          priceChange: updatedCoin.priceChange,
          changePercent: updatedCoin.changePercent,
          volume: updatedCoin.volume,
          marketCap: updatedCoin.marketCap
        };
      }
      return asset;
    });
    setAssets(updatedAssets);
  };
  
  const toggleAlert = (id: string) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, alertEnabled: !asset.alertEnabled } : asset
    );
    setAssets(updatedAssets);
  };
  
  const setThreshold = (id: string, value: number) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, alertThreshold: value } : asset
    );
    setAssets(updatedAssets);
  };
  
  const toggleGlobalAlerts = () => {
    setIsGlobalAlertsEnabled(!isGlobalAlertsEnabled);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Alerts</CardTitle>
        <CardDescription>
          Configure real-time alerts for your favorite cryptocurrencies
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="global-alerts">Global Alerts</Label>
          <Switch 
            id="global-alerts"
            checked={isGlobalAlertsEnabled}
            onCheckedChange={toggleGlobalAlerts}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Alert Frequency ({alertFrequency} seconds)</Label>
          <Slider
            defaultValue={[alertFrequency]}
            max={300}
            step={30}
            onValueChange={(value) => setAlertFrequency(value[0])}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          Next alert check: {nextAlertCheck.toLocaleTimeString()}
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead className="text-right">Alerts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name} ({asset.symbol})</TableCell>
                <TableCell>${asset.price.toFixed(2)}</TableCell>
                <TableCell className={asset.priceChange > 0 ? "text-green-500" : "text-red-500"}>
                  {asset.priceChange > 0 && "+"}${asset.priceChange.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                </TableCell>
                <TableCell>${(asset.volume / 1000000000).toFixed(2)}B</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Switch
                      id={`alert-${asset.id}`}
                      checked={asset.alertEnabled}
                      onCheckedChange={() => toggleAlert(asset.id)}
                      disabled={!isGlobalAlertsEnabled}
                    />
                    <Label htmlFor={`alert-${asset.id}`} className="text-right">
                      {asset.alertEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
