
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, RefreshCw, Settings, Link, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { TradingAccount } from "@/types/trading";

// Mock data for trading accounts
const mockAccounts: TradingAccount[] = [
  {
    id: "acc-1",
    name: "Binance Main",
    type: "exchange",
    provider: "Binance",
    balance: 4230.50,
    currency: "USD",
    lastUpdated: "2025-05-02T10:34:12Z",
    isActive: true,
    assets: [
      { id: "btc", symbol: "BTC", name: "Bitcoin", amount: 0.05, value: 3276.18 },
      { id: "eth", symbol: "ETH", name: "Ethereum", amount: 0.28, value: 957.82 }
    ]
  },
  {
    id: "acc-2",
    name: "KuCoin Trading",
    type: "exchange",
    provider: "KuCoin",
    balance: 1850.75,
    currency: "USD",
    lastUpdated: "2025-05-01T15:22:45Z",
    isActive: true,
    assets: [
      { id: "sol", symbol: "SOL", name: "Solana", amount: 10.5, value: 1543.28 },
      { id: "ada", symbol: "ADA", name: "Cardano", amount: 500, value: 307.47 }
    ]
  },
  {
    id: "acc-3",
    name: "Metamask Wallet",
    type: "wallet",
    provider: "MetaMask",
    balance: 2145.30,
    currency: "USD",
    lastUpdated: "2025-04-30T22:17:39Z",
    isActive: false,
    assets: [
      { id: "eth", symbol: "ETH", name: "Ethereum", amount: 0.62, value: 2145.30 }
    ]
  }
];

const AccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>(mockAccounts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshAccounts = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trading Accounts</CardTitle>
            <CardDescription>
              Manage your connected exchange accounts and wallets
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshAccounts} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Link className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No accounts connected</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-sm">
              Connect your first exchange account or wallet to start trading
            </p>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Balance</TableHead>
                <TableHead className="hidden md:table-cell">Assets</TableHead>
                <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/icon/${account.provider.toLowerCase()}.png`}
                        alt={account.provider}
                        className="w-5 h-5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/icon/generic.png";
                        }}
                      />
                      {account.provider}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${account.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {account.assets?.length || 0} assets
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatLastUpdated(account.lastUpdated)}
                  </TableCell>
                  <TableCell>
                    {account.isActive ? (
                      <Badge className="flex items-center gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <span>
            Connected Accounts: {accounts.length} ({accounts.filter(a => a.isActive).length} active)
          </span>
          <span className="mt-2 sm:mt-0">
            Total Balance: ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccountManager;
