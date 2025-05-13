
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AITradingStrategy, BacktestResults } from "@/types/trading";
import { Robot, Play, Pause, LineChart, Settings, Trash2, BarChart2 } from "lucide-react";
import { formatPrice } from '@/services/cryptoService';
import { toast } from '@/components/ui/use-toast';

interface Bot {
  id: string;
  name: string;
  strategy: AITradingStrategy;
  coinId: string;
  coinSymbol: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  createdAt: string;
  lastRun?: string;
  performance?: {
    trades: number;
    winRate: number;
    profit: number;
    profitPercentage: number;
  };
  config?: any;
}

interface AiTradingBotListProps {
  bots: Bot[];
  onStartBot: (botId: string) => void;
  onStopBot: (botId: string) => void;
  onDeleteBot: (botId: string) => void;
  onViewBot: (botId: string) => void;
  isLoading?: boolean;
}

// Mock data for the sample bots
const mockBots: Bot[] = [
  {
    id: 'bot-1',
    name: 'BTC Trend Follower',
    strategy: {
      id: 'trend-following',
      name: 'AI Trend Following',
      description: 'Uses machine learning to identify and follow market trends',
      type: 'trend-following',
      timeframe: '1d',
      riskLevel: 'medium',
      indicators: ['SMA', 'EMA', 'MACD', 'RSI'],
    },
    coinId: 'bitcoin',
    coinSymbol: 'BTC',
    status: 'running',
    createdAt: '2023-08-15T10:30:00Z',
    lastRun: '2023-09-22T14:45:00Z',
    performance: {
      trades: 42,
      winRate: 68.5,
      profit: 2845.32,
      profitPercentage: 28.45
    }
  },
  {
    id: 'bot-2',
    name: 'ETH Mean Reversion',
    strategy: {
      id: 'mean-reversion',
      name: 'AI Mean Reversion',
      description: 'Identifies overbought and oversold conditions using AI',
      type: 'mean-reversion',
      timeframe: '4h',
      riskLevel: 'medium',
      indicators: ['RSI', 'Bollinger Bands', 'Stochastic', 'MFI'],
    },
    coinId: 'ethereum',
    coinSymbol: 'ETH',
    status: 'paused',
    createdAt: '2023-09-05T16:20:00Z',
    lastRun: '2023-09-21T09:15:00Z',
    performance: {
      trades: 28,
      winRate: 71.4,
      profit: 1328.79,
      profitPercentage: 13.29
    }
  },
  {
    id: 'bot-3',
    name: 'SOL Breakout Detector',
    strategy: {
      id: 'breakout',
      name: 'AI Breakout Detection',
      description: 'Identifies and trades significant price breakouts',
      type: 'breakout',
      timeframe: '1h',
      riskLevel: 'high',
      indicators: ['ATR', 'Volume', 'Support/Resistance', 'Volatility'],
    },
    coinId: 'solana',
    coinSymbol: 'SOL',
    status: 'error',
    createdAt: '2023-09-10T11:45:00Z',
    lastRun: '2023-09-22T08:30:00Z',
    performance: {
      trades: 16,
      winRate: 62.5,
      profit: -350.18,
      profitPercentage: -3.50
    }
  }
];

const AiTradingBotList: React.FC<AiTradingBotListProps> = ({
  bots = mockBots,
  onStartBot,
  onStopBot,
  onDeleteBot,
  onViewBot,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBots, setFilteredBots] = useState<Bot[]>(bots);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bot | 'performance.profit'; direction: 'asc' | 'desc' }>({ 
    key: 'coinId', 
    direction: 'asc' 
  });
  
  useEffect(() => {
    // Filter bots based on search term
    const filtered = bots.filter(bot => 
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.coinId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.coinSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.strategy.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort filtered bots
    const sorted = [...filtered].sort((a, b) => {
      if (sortConfig.key === 'performance.profit') {
        const aValue = a.performance?.profit || 0;
        const bValue = b.performance?.profit || 0;
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      } else {
        // @ts-ignore - Dynamic key access
        const aValue = a[sortConfig.key];
        // @ts-ignore - Dynamic key access
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Fall back to simple comparison
        return sortConfig.direction === 'asc'
          ? (aValue > bValue ? 1 : -1)
          : (bValue > aValue ? 1 : -1);
      }
    });
    
    setFilteredBots(sorted);
  }, [bots, searchTerm, sortConfig]);
  
  const handleSort = (key: keyof Bot | 'performance.profit') => {
    if (sortConfig.key === key) {
      // Toggle direction if same key
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to ascending for new key
      setSortConfig({
        key,
        direction: 'asc'
      });
    }
  };
  
  const handleBotAction = (bot: Bot, action: 'start' | 'stop' | 'delete' | 'view') => {
    switch (action) {
      case 'start':
        onStartBot(bot.id);
        toast({
          title: `Bot Started`,
          description: `${bot.name} is now running`,
        });
        break;
      case 'stop':
        onStopBot(bot.id);
        toast({
          title: `Bot Paused`,
          description: `${bot.name} has been paused`,
        });
        break;
      case 'delete':
        onDeleteBot(bot.id);
        toast({
          title: `Bot Deleted`,
          description: `${bot.name} has been removed`,
          variant: "destructive"
        });
        break;
      case 'view':
        onViewBot(bot.id);
        break;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot className="h-5 w-5" />
          AI Trading Bots
        </CardTitle>
        <CardDescription>
          Manage your active trading bots and monitor performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bots..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="default" size="sm" className="whitespace-nowrap">
              <Robot className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredBots.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]" onClick={() => handleSort('name')}>
                    Bot Name
                  </TableHead>
                  <TableHead onClick={() => handleSort('coinId')}>Asset</TableHead>
                  <TableHead onClick={() => handleSort('strategy.type')}>Strategy</TableHead>
                  <TableHead className="hidden md:table-cell" onClick={() => handleSort('status')}>Status</TableHead>
                  <TableHead className="hidden md:table-cell text-right" onClick={() => handleSort('performance.winRate')}>
                    Win Rate
                  </TableHead>
                  <TableHead className="text-right" onClick={() => handleSort('performance.profit')}>
                    P/L
                  </TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBots.map((bot) => (
                  <TableRow key={bot.id} className="cursor-pointer" onClick={() => handleBotAction(bot, 'view')}>
                    <TableCell>
                      <div className="font-medium">{bot.name}</div>
                    </TableCell>
                    <TableCell>{bot.coinSymbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{bot.strategy.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          bot.status === 'running' ? 'bg-green-500' :
                          bot.status === 'paused' ? 'bg-yellow-500' : 
                          bot.status === 'error' ? 'bg-red-500' : 'bg-slate-500'
                        }`} />
                        <span className="capitalize">{bot.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {bot.performance ? `${bot.performance.winRate}%` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={bot.performance && bot.performance.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {bot.performance ? formatPrice(bot.performance.profit) : 'N/A'}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {bot.performance ? `${bot.performance.profitPercentage >= 0 ? '+' : ''}${bot.performance.profitPercentage.toFixed(2)}%` : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {bot.status === 'running' ? (
                          <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot, 'stop')}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot, 'start')}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot, 'view')}>
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot, 'delete')}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 bg-muted rounded-md">
            <Robot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Trading Bots Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No bots match your search criteria' : 'You haven\'t created any trading bots yet'}
            </p>
            <Button>Create Your First Bot</Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="w-full flex justify-between text-sm text-muted-foreground">
          <span>{filteredBots.length} bots</span>
          <span>
            <LineChart className="inline-block h-4 w-4 mr-1" />
            Paper trading enabled
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiTradingBotList;
