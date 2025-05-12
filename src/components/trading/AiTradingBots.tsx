
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Plus, Play, Pause } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

interface AiTradingBotsProps {
  onCreateBot?: () => void;
  onSelectBot?: (botId: string) => void;
}

const AiTradingBots: React.FC<AiTradingBotsProps> = ({
  onCreateBot,
  onSelectBot
}) => {
  // State for active bots
  const [bots, setBots] = useState<AITradingStrategy[]>(predefinedStrategies);
  const [activeStatus, setActiveStatus] = useState<Record<string, boolean>>({
    'strategy-1': true,
    'strategy-2': false,
    'strategy-3': false
  });
  
  // Toggle bot active status
  const toggleBotStatus = (botId: string) => {
    setActiveStatus(prev => ({
      ...prev,
      [botId]: !prev[botId]
    }));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Trading Bots
        </CardTitle>
        
        <Button variant="outline" size="sm" onClick={onCreateBot}>
          <Plus className="mr-1 h-4 w-4" />
          New Bot
        </Button>
      </CardHeader>
      
      <CardContent>
        {bots.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No trading bots configured</p>
            <Button onClick={onCreateBot} className="mt-4">Create Your First Bot</Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bot</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map((bot) => (
                  <TableRow key={bot.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectBot && onSelectBot(bot.id)}>
                    <TableCell className="font-medium">{bot.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{bot.type}</span>
                        <span className="text-xs text-muted-foreground">{bot.timeframe} timeframe</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {bot.assets && bot.assets.slice(0, 3).map(asset => (
                          <Badge key={asset} variant="outline" className="text-xs">
                            {asset.slice(0, 3).toUpperCase()}
                          </Badge>
                        ))}
                        {bot.assets && bot.assets.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{bot.assets.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {activeStatus[bot.id] ? (
                        <Badge variant="success" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBotStatus(bot.id);
                        }}
                      >
                        {activeStatus[bot.id] ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
