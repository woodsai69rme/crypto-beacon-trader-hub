
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAiTrading } from "@/contexts/AiTradingContext";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { LinkIcon, Unlink } from "lucide-react";

interface BotAccountConnectorProps {
  botId: string;
  botName: string;
}

const BotAccountConnector: React.FC<BotAccountConnectorProps> = ({ botId, botName }) => {
  const { accounts } = useTradingAccounts();
  const { connectBotToAccount, disconnectBot, getConnectedAccount } = useAiTrading();
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);

  // Get currently connected account
  const connectedAccountId = getConnectedAccount(botId);
  
  // Set selected account to connected account on load
  useEffect(() => {
    if (connectedAccountId) {
      setSelectedAccountId(connectedAccountId);
    }
  }, [connectedAccountId]);

  // Filter accounts that allow bots
  const eligibleAccounts = accounts.filter(account => !account.allowBots || account.allowBots === true);
  
  const handleConnect = () => {
    if (!selectedAccountId) {
      toast({
        title: "Account Required",
        description: "Please select an account to connect with the bot",
        variant: "destructive"
      });
      return;
    }
    
    connectBotToAccount(botId, selectedAccountId);
    
    toast({
      title: "Bot Connected",
      description: `${botName} has been connected to the selected account`
    });
  };
  
  const handleDisconnect = () => {
    disconnectBot(botId);
    setSelectedAccountId(undefined);
    
    toast({
      title: "Bot Disconnected",
      description: `${botName} has been disconnected from the account`
    });
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">
            {connectedAccountId ? "Currently Connected Account" : "Connect to Trading Account"}
          </div>
          
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {eligibleAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${account.balance.toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="pt-2">
            {connectedAccountId ? (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="w-full"
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnect}
                disabled={!selectedAccountId}
                className="w-full"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotAccountConnector;
