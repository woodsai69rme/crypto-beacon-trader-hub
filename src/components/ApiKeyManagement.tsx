import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { clearApiCache } from "@/services/enhancedCryptoApi";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Trash, Plus, RefreshCw } from "lucide-react";

const ApiKeyManagement: React.FC = () => {
  const [coinGeckoKey, setCoinGeckoKey] = useState('');
  const [cryptoCompareKey, setCryptoCompareKey] = useState('');
  const [coinMarketCapKey, setCoinMarketCapKey] = useState('');
  const [isLoadingCG, setIsLoadingCG] = useState(false);
  const [isLoadingCC, setIsLoadingCC] = useState(false);
  const [isLoadingCMC, setIsLoadingCMC] = useState(false);
  const [isCoinGeckoEnabled, setIsCoinGeckoEnabled] = useState(true);
  const [isCryptoCompareEnabled, setIsCryptoCompareEnabled] = useState(true);
  const [isCoinMarketCapEnabled, setIsCoinMarketCapEnabled] = useState(false);

  const handleSaveAPIKey = (service: string, key: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Save the API key to localStorage
    localStorage.setItem(`apiKey_${service}`, key);
    toast({
      title: 'API Key Saved',
      description: `Your ${service} API key has been saved successfully.`,
    });
  };

  const handleClearCache = () => {
    clearApiCache();
    toast({
      title: 'Cache Cleared',
      description: 'API cache has been cleared successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CoinGecko API</CardTitle>
          <CardDescription>
            Configure your CoinGecko API key for increased rate limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={isCoinGeckoEnabled} 
              onCheckedChange={setIsCoinGeckoEnabled} 
              id="coingecko-toggle"
            />
            <Label htmlFor="coingecko-toggle">Enable CoinGecko API</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coingecko-api-key">API Key (Pro plan required)</Label>
            <div className="flex space-x-2">
              <Input 
                id="coingecko-api-key" 
                value={coinGeckoKey} 
                onChange={(e) => setCoinGeckoKey(e.target.value)} 
                placeholder="Enter your CoinGecko API key"
                disabled={!isCoinGeckoEnabled}
              />
              <Button 
                onClick={() => {
                  setIsLoadingCG(true);
                  setTimeout(() => {
                    handleSaveAPIKey('coingecko', coinGeckoKey, setCoinGeckoKey);
                    setIsLoadingCG(false);
                  }, 500);
                }}
                disabled={isLoadingCG || !isCoinGeckoEnabled}
              >
                {isLoadingCG ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CryptoCompare API</CardTitle>
          <CardDescription>
            Configure your CryptoCompare API key for market data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={isCryptoCompareEnabled} 
              onCheckedChange={setIsCryptoCompareEnabled} 
              id="cryptocompare-toggle"
            />
            <Label htmlFor="cryptocompare-toggle">Enable CryptoCompare API</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cryptocompare-api-key">API Key</Label>
            <div className="flex space-x-2">
              <Input 
                id="cryptocompare-api-key" 
                value={cryptoCompareKey} 
                onChange={(e) => setCryptoCompareKey(e.target.value)} 
                placeholder="Enter your CryptoCompare API key"
                disabled={!isCryptoCompareEnabled}
              />
              <Button 
                onClick={() => {
                  setIsLoadingCC(true);
                  setTimeout(() => {
                    handleSaveAPIKey('cryptocompare', cryptoCompareKey, setCryptoCompareKey);
                    setIsLoadingCC(false);
                  }, 500);
                }}
                disabled={isLoadingCC || !isCryptoCompareEnabled}
              >
                {isLoadingCC ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CoinMarketCap API</CardTitle>
          <CardDescription>
            Configure your CoinMarketCap API key for extended market data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={isCoinMarketCapEnabled} 
              onCheckedChange={setIsCoinMarketCapEnabled} 
              id="coinmarketcap-toggle"
            />
            <Label htmlFor="coinmarketcap-toggle">Enable CoinMarketCap API</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coinmarketcap-api-key">API Key</Label>
            <div className="flex space-x-2">
              <Input 
                id="coinmarketcap-api-key" 
                value={coinMarketCapKey} 
                onChange={(e) => setCoinMarketCapKey(e.target.value)} 
                placeholder="Enter your CoinMarketCap API key"
                disabled={!isCoinMarketCapEnabled}
              />
              <Button 
                onClick={() => {
                  setIsLoadingCMC(true);
                  setTimeout(() => {
                    handleSaveAPIKey('coinmarketcap', coinMarketCapKey, setCoinMarketCapKey);
                    setIsLoadingCMC(false);
                  }, 500);
                }}
                disabled={isLoadingCMC || !isCoinMarketCapEnabled}
              >
                {isLoadingCMC ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Cache Management</CardTitle>
          <CardDescription>
            Control the API cache to refresh data or troubleshoot issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleClearCache}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear API Cache
          </Button>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Clearing the cache will force fresh API requests on next data load.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
