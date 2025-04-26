
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { useAiTrading } from "@/contexts/AiTradingContext";
import { Bot, Link2, LinkOff } from "lucide-react";

interface BotAccountConnectorProps {
  botId: string;
  botName: string;
  className?: string;
}

const BotAccountConnector: React.FC<BotAccountConnectorProps> = ({ botId, botName, className }) => {
  const { accounts } = useTradingAccounts();
  const { connectBotToAccount, disconnectBot, getConnectedAccount, activeBots } = useAiTrading();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  
  const connectedAccountId = getConnectedAccount(botId);
  const connectedAccount = accounts.find(a => a.id === connectedAccountId);
  
  const handleConnect = () => {
    if (selectedAccountId) {
      connectBotToAccount(botId, selectedAccountId);
      setSelectedAccountId("");
    }
  };
  
  const handleDisconnect = () => {
    disconnectBot(botId);
  };
  
  if (connectedAccountId) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex-1 flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">
            Connected to <span className="font-medium">{connectedAccount?.name || 'Account'}</span>
          </span>
          {activeBots[botId]?.lastTrade && (
            <span className="text-xs text-muted-foreground ml-2">
              Last trade: {new Date(activeBots[botId].lastTrade!).toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect} 
          className="ml-2"
        >
          <LinkOff className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <Select 
        value={selectedAccountId}
        onValueChange={setSelectedAccountId}
      >
        <SelectTrigger className="flex-1 max-w-[250px]">
          <SelectValue placeholder="Select trading account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map(account => (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                {account.name} (${account.balance.toLocaleString()})
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleConnect} 
        disabled={!selectedAccountId}
        className="ml-2"
      >
        <Link2 className="h-4 w-4 mr-1" />
        Connect
      </Button>
    </div>
  );
};

export default BotAccountConnector;
