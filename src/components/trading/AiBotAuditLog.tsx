
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { Bot, Activity, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface AiBotAuditLogProps {
  botId?: string | null;
}

const AiBotAuditLog: React.FC<AiBotAuditLogProps> = ({ botId }) => {
  const { bots } = useAiTrading();
  
  const selectedBot = botId ? bots.find(bot => bot.id === botId) : null;
  const allLogs = selectedBot 
    ? selectedBot.auditLog 
    : bots.flatMap(bot => 
        bot.auditLog.map(entry => ({ ...entry, botName: bot.name, botId: bot.id }))
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TRADE_EXECUTED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ANALYSIS': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'ERROR': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'TRADE_EXECUTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ANALYSIS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {selectedBot ? `Audit Log: ${selectedBot.name}` : 'All Bots Audit Log'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit entries yet. Activate bots to see their activities here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {allLogs.map((entry, index) => (
                <div key={entry.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(entry.action)}
                      <Badge className={getActionColor(entry.action)}>
                        {entry.action}
                      </Badge>
                      {'botName' in entry && (
                        <Badge variant="outline">{entry.botName}</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">{entry.reasoning}</p>
                    
                    {entry.signal && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <h4 className="font-medium text-sm mb-2">Trading Signal</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Signal:</span>
                            <div className="font-medium">{entry.signal.signal}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <div className="font-medium">{(entry.signal.confidence * 100).toFixed(1)}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Entry Price:</span>
                            <div className="font-medium">AUD {entry.signal.entryPrice.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <div className="font-medium">AUD {entry.signal.targetPrice.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {entry.result && (
                      <div className="bg-green-50 border border-green-200 p-2 rounded text-sm">
                        <strong>Result:</strong> {entry.result}
                      </div>
                    )}

                    {entry.marketData && (
                      <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                        <strong>Market Data:</strong> {entry.marketData.symbol} - AUD {entry.marketData.price.toLocaleString()} 
                        ({entry.marketData.change24h > 0 ? '+' : ''}{entry.marketData.change24h.toFixed(2)}%)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AiBotAuditLog;
