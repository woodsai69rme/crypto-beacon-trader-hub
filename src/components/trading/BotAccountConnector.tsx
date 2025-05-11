
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleEllipsis, Bot, Power, AlertTriangle } from 'lucide-react';

export interface AccountWithBotsEnabled {
  id?: string;
  name?: string;
  exchange?: string;
  balance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
}

// Mock account data
const availableAccounts: AccountWithBotsEnabled[] = [
  {
    id: "acc-1",
    name: "Main Trading Account",
    exchange: "Binance",
    balance: 10245.32,
    currency: "USDT",
    connected: true,
    isActive: true,
    provider: "Binance"
  },
  {
    id: "acc-2",
    name: "Spot Portfolio",
    exchange: "Coinbase",
    balance: 5782.17,
    currency: "USD",
    connected: true,
    isActive: false,
    provider: "Coinbase"
  },
  {
    id: "acc-3",
    name: "Test Account",
    exchange: "KuCoin",
    balance: 1200.00,
    currency: "USDT",
    connected: true,
    isActive: false,
    provider: "KuCoin"
  }
];

interface BotAccountConnectorProps {
  onAccountSelect: (account: AccountWithBotsEnabled) => void;
  selectedAccountId?: string;
}

const BotAccountConnector: React.FC<BotAccountConnectorProps> = ({ 
  onAccountSelect,
  selectedAccountId
}) => {
  const [accounts, setAccounts] = useState<AccountWithBotsEnabled[]>(availableAccounts);
  
  const toggleAccountActive = (accountId: string | undefined, isActive: boolean) => {
    if (!accountId) return;
    
    const updatedAccounts = accounts.map(acc => 
      acc.id === accountId ? { ...acc, isActive } : acc
    );
    
    setAccounts(updatedAccounts);
    
    const selectedAccount = updatedAccounts.find(acc => acc.id === accountId);
    if (selectedAccount && isActive) {
      onAccountSelect(selectedAccount);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Bot-Enabled Accounts
        </CardTitle>
        <CardDescription>
          Connect trading accounts to enable AI trading bots
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map(account => (
              <div
                key={account.id}
                className={`border rounded-lg p-4 ${account.id === selectedAccountId ? 'border-primary' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{account.name}</h3>
                      {account.isActive && (
                        <Badge className="ml-2 bg-green-500">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {account.exchange}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <CircleEllipsis className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-medium">
                      {account.balance?.toLocaleString()} {account.currency}
                    </p>
                  </div>
                  
                  <Button
                    variant={account.isActive ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleAccountActive(account.id, !account.isActive)}
                  >
                    <Power className="h-4 w-4" />
                    {account.isActive ? "Disable" : "Enable"}
                  </Button>
                </div>
                
                {account.provider && (
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <span>Provider: {account.provider}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-4 font-medium">No Trading Accounts Available</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              Connect exchange accounts with API keys to enable AI bot trading
            </p>
            <Button className="mt-4">Connect Exchange Account</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotAccountConnector;
