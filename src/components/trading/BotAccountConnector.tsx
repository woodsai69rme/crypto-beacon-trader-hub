
import React, { useState } from "react";
import { Bot, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TradingAccount } from "@/types/trading";

// Define interface needed for this component
interface AccountWithBotsEnabled extends TradingAccount {
  botsEnabled: boolean;
}

const mockAccounts: AccountWithBotsEnabled[] = [
  {
    id: "acc1",
    name: "Binance Account",
    type: "exchange",
    provider: "Binance",
    balance: 2540.75,
    currency: "USD",
    lastUpdated: "2025-04-30T15:30:00Z",
    isActive: true,
    botsEnabled: true
  },
  {
    id: "acc2",
    name: "Coinbase Pro",
    type: "exchange",
    provider: "Coinbase",
    balance: 1250.50,
    currency: "USD",
    lastUpdated: "2025-05-01T09:15:00Z",
    isActive: true,
    botsEnabled: false
  },
  {
    id: "acc3",
    name: "KuCoin Account",
    type: "exchange",
    provider: "KuCoin",
    balance: 780.25,
    currency: "USD",
    lastUpdated: "2025-04-29T18:45:00Z",
    isActive: false,
    botsEnabled: false
  }
];

const BotAccountConnector: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountWithBotsEnabled[]>(mockAccounts);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleBotAccess = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, botsEnabled: !account.botsEnabled }
        : account
    ));
  };
  
  const refreshAccounts = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Bot-Enabled Accounts
            </CardTitle>
            <CardDescription>
              Connect your trading accounts to enable AI trading bots
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshAccounts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No trading accounts connected yet. <br />
              Connect an account to get started with AI trading bots.
            </p>
            <Button className="mt-4">Connect Account</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map(account => (
              <div 
                key={account.id}
                className={`p-4 rounded-lg border ${account.isActive ? 'border-border' : 'border-muted bg-muted/30'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                      <img 
                        src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/icon/${account.provider.toLowerCase()}.png`}
                        alt={account.provider}
                        className="w-6 h-6"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/icon/generic.png";
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {account.name}
                        {!account.isActive && (
                          <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Balance: ${account.balance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {account.isActive && (
                      <Button
                        variant={account.botsEnabled ? "default" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={() => toggleBotAccess(account.id)}
                      >
                        {account.botsEnabled ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Bot Access Granted
                          </>
                        ) : (
                          <>
                            Enable Bots
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {account.botsEnabled && account.isActive && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Trading Permission Granted</p>
                        <p className="text-muted-foreground">
                          AI trading bots can now execute trades on this account. 
                          You can revoke this permission at any time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
          <div className="space-x-2">
            <Button variant="outline">API Settings</Button>
            <Button>Connect New Account</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BotAccountConnector;
