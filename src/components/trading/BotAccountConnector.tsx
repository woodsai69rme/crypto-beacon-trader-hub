
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TradingAccount } from "@/types/trading";

interface BotAccountConnectorProps {
  accounts: TradingAccount[];
  onAccountSelect: (accountId: string) => void;
  selectedAccountId: string;
}

interface AccountWithBotsEnabled extends TradingAccount {
  allowBots?: boolean;
}

const BotAccountConnector: React.FC<BotAccountConnectorProps> = ({
  accounts,
  onAccountSelect,
  selectedAccountId,
}) => {
  const [accountsWithBotSettings, setAccountsWithBotSettings] = useState<AccountWithBotsEnabled[]>([]);

  useEffect(() => {
    // Initialize accounts with bot settings
    setAccountsWithBotSettings(
      accounts.map((account) => ({
        ...account,
        allowBots: account.id === selectedAccountId ? true : false,
      }))
    );
  }, [accounts, selectedAccountId]);

  const handleToggleBots = (accountId: string, allowed: boolean) => {
    const updatedAccounts = accountsWithBotSettings.map((account) => {
      if (account.id === accountId) {
        return { ...account, allowBots: allowed };
      }
      return account;
    });

    setAccountsWithBotSettings(updatedAccounts);

    // If enabling bots for an account, select that account
    if (allowed) {
      onAccountSelect(accountId);
    } else if (accountId === selectedAccountId) {
      // If disabling the currently selected account, find another enabled one
      const nextEnabledAccount = updatedAccounts.find(
        (a) => a.allowBots && a.id !== accountId
      );
      if (nextEnabledAccount) {
        onAccountSelect(nextEnabledAccount.id);
      } else {
        onAccountSelect(""); // No enabled accounts
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">
              Select Trading Account for Bots
            </h3>
            <Select
              value={selectedAccountId}
              onValueChange={onAccountSelect}
              disabled={!accountsWithBotSettings.some((a) => a.allowBots)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accountsWithBotSettings
                  .filter((a) => a.allowBots)
                  .map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (${account.balance.toFixed(2)})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">
              Account Bot Permissions
            </h3>
            {accountsWithBotSettings.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: ${account.balance.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {account.allowBots && (
                    <Badge variant="outline" className="bg-primary/10">
                      Bot Enabled
                    </Badge>
                  )}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`bot-${account.id}`}>
                      {account.allowBots ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id={`bot-${account.id}`}
                      checked={account.allowBots}
                      onCheckedChange={(checked) =>
                        handleToggleBots(account.id, checked)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotAccountConnector;
