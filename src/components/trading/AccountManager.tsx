
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioAsset } from "@/types/trading";
import { Wallet, RefreshCw, PlusCircle } from "lucide-react";

interface TradingAccount {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  isActive: boolean;
  assets?: PortfolioAsset[];
}

const AccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: "account-1",
      name: "Main Trading Account",
      type: "spot",
      provider: "Binance",
      balance: 12580.45,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      isActive: true,
      assets: [
        {
          coinId: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          amount: 0.35,
          price: 28500,
          value: 9975,
          allocation: 79.3,
          change24h: 450,
          changePercent24h: 1.58
        },
        {
          coinId: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          amount: 1.8,
          price: 1450,
          value: 2610,
          allocation: 20.7,
          change24h: -32,
          changePercent24h: -1.2
        }
      ]
    },
    {
      id: "account-2",
      name: "HODL Portfolio",
      type: "long-term",
      provider: "Kraken",
      balance: 8750.25,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      isActive: true,
      assets: [
        {
          coinId: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          amount: 0.15,
          price: 28500,
          value: 4275,
          allocation: 48.8,
          change24h: 195,
          changePercent24h: 1.58
        },
        {
          coinId: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          amount: 2.5,
          price: 1450,
          value: 3625,
          allocation: 41.4,
          change24h: -45,
          changePercent24h: -1.2
        },
        {
          coinId: "solana",
          symbol: "SOL",
          name: "Solana",
          amount: 15,
          price: 56.75,
          value: 851.25,
          allocation: 9.7,
          change24h: 35.5,
          changePercent24h: 2.1
        }
      ]
    }
  ]);
  
  const [loading, setLoading] = useState<boolean>(false);
  
  const refreshAccounts = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Trading Accounts</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={refreshAccounts} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="accounts">
          <TabsList className="mb-4">
            <TabsTrigger value="accounts">All Accounts</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <div className="space-y-4">
              {accounts.map(account => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2 text-primary" />
                        <h3 className="font-medium">{account.name}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {account.provider} • {account.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${account.balance.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date(account.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {account.assets && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Assets</div>
                      <div className="space-y-2">
                        {account.assets.map(asset => (
                          <div key={asset.coinId} className="flex justify-between">
                            <div>
                              <span className="font-medium">{asset.symbol}</span>
                              <span className="text-muted-foreground ml-1">
                                {asset.amount} ({asset.allocation.toFixed(1)}%)
                              </span>
                            </div>
                            <div>
                              <span>${asset.value.toLocaleString()}</span>
                              <span 
                                className={`ml-2 ${asset.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                              >
                                {asset.changePercent24h >= 0 ? '+' : ''}
                                {asset.changePercent24h.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">Deposit</Button>
                    <Button variant="outline" size="sm">Withdraw</Button>
                    <Button size="sm">Trade</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="assets">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {accounts.flatMap(account => account.assets || []).map((asset, index) => (
                      <tr key={`${asset.coinId}-${index}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium">{asset.symbol}</div>
                            <div className="ml-2 text-muted-foreground text-sm">{asset.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {asset.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          ${asset.value.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className={asset.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {asset.changePercent24h >= 0 ? '+' : ''}
                            {asset.changePercent24h.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {asset.allocation.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountManager;
