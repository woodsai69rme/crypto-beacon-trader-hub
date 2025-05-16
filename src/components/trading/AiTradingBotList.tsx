
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Bot, Play, Pause, Settings, Trash2, ChevronRight } from "lucide-react";
import { AITradingBot } from "@/types/trading";

interface AiTradingBotListProps {
  bots: AITradingBot[];
  onStartBot: (botId: string) => void;
  onStopBot: (botId: string) => void;
  onDeleteBot: (botId: string) => void;
  onViewBot: (botId: string) => void;
}

const AiTradingBotList: React.FC<AiTradingBotListProps> = ({
  bots,
  onStartBot,
  onStopBot,
  onDeleteBot,
  onViewBot
}) => {
  // Display placeholder if no bots
  if (!bots || bots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Bots</CardTitle>
          <CardDescription>Create and manage your AI trading bots</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Trading Bots</h3>
          <p className="text-muted-foreground mb-4">
            Create your first AI trading bot using the strategy selection screen
          </p>
          <Button>Create Bot</Button>
        </CardContent>
      </Card>
    );
  }

  // Display bot list
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trading Bots</CardTitle>
            <CardDescription>Manage your automated trading strategies</CardDescription>
          </div>
          <Button size="sm">
            <Bot className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead>Trades</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell>
                  <div className="font-medium">{bot.name}</div>
                  <div className="text-sm text-muted-foreground">{bot.pair || 'All pairs'}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{bot.strategy.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      bot.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      bot.status === 'paused' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }
                  >
                    {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={(bot.profitLoss || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                    {(bot.profitLoss || 0) >= 0 ? "+" : ""}{(bot.profitLoss || 0).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>{bot.totalTrades || 0}</TableCell>
                <TableCell>
                  <Switch 
                    checked={bot.status === 'active'} 
                    onCheckedChange={(checked) => {
                      if (checked) onStartBot(bot.id);
                      else onStopBot(bot.id);
                    }}
                  />
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {bot.status === 'paused' ? (
                    <Button variant="ghost" size="icon" onClick={() => onStartBot(bot.id)}>
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : bot.status === 'active' ? (
                    <Button variant="ghost" size="icon" onClick={() => onStopBot(bot.id)}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : null}
                  
                  <Button variant="ghost" size="icon" onClick={() => onViewBot(bot.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={() => onDeleteBot(bot.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={() => onViewBot(bot.id)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotList;
