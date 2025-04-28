
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';
import { toast } from '@/components/ui/use-toast';
import { LinkIcon, Unlink } from 'lucide-react';

interface BotAccountConnectorProps {
  botId: string;
  botName: string;
}

const BotAccountConnector: React.FC<BotAccountConnectorProps> = ({
  botId,
  botName
}) => {
  const { accounts } = useTradingAccounts();
  const { connectBotToAccount, disconnectBot, getConnectedAccount } = useAiTrading();
  
  const connectedAccountId = getConnectedAccount(botId);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(connectedAccountId || '');
  
  const eligibleAccounts = accounts.filter(account => account.allowBots);
  
  const handleConnectAccount = () => {
    if (!selectedAccountId) {
      toast({
        title: "No Account Selected",
        description: "Please select an account to connect",
        variant: "destructive"
      });
      return;
    }
    
    connectBotToAccount(botId, selectedAccountId);
    
    toast({
      title: "Account Connected",
      description: `${botName} has been connected to the selected account`
    });
  };
  
  const handleDisconnectAccount = () => {
    disconnectBot(botId);
    setSelectedAccountId('');
    
    toast({
      title: "Account Disconnected",
      description: `${botName} has been disconnected from the account`
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Connect to Trading Account</label>
        
        <div className="flex space-x-2">
          <Select 
            value={selectedAccountId} 
            onValueChange={setSelectedAccountId}
            disabled={!!connectedAccountId}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {eligibleAccounts.length > 0 ? (
                eligibleAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (${account.balance.toLocaleString()})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No eligible accounts found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {connectedAccountId ? (
            <Button 
              variant="outline" 
              onClick={handleDisconnectAccount}
              className="shrink-0"
            >
              <Unlink className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button 
              onClick={handleConnectAccount} 
              disabled={!selectedAccountId || eligibleAccounts.length === 0}
              className="shrink-0"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>
      
      {connectedAccountId && (
        <div className="text-xs text-muted-foreground">
          <span className="text-green-500">●</span> Connected to{' '}
          {accounts.find(acc => acc.id === connectedAccountId)?.name || 'Unknown account'}
        </div>
      )}
      
      {eligibleAccounts.length === 0 && (
        <div className="text-sm text-amber-500">
          No accounts with bot trading enabled. Please enable bot trading on an account first.
        </div>
      )}
    </div>
  );
};

export default BotAccountConnector;
