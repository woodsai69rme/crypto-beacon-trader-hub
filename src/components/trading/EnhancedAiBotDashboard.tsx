
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bot, Play, Pause, Settings, TrendingUp, Filter, Search, BarChart3 } from 'lucide-react';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { AIBot } from '@/types/trading';

const EnhancedAiBotDashboard: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [filteredBots, setFilteredBots] = useState<AIBot[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allBots = enhancedAiBotService.getAllBots();
    setBots(allBots);
    setFilteredBots(allBots);
  }, []);

  useEffect(() => {
    let filtered = bots;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(bot => bot.status === filterStatus);
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(bot => bot.riskLevel === filterRisk);
    }

    if (searchTerm) {
      filtered = filtered.filter(bot => 
        bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.strategy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBots(filtered);
  }, [bots, filterStatus, filterRisk, searchTerm]);

  const toggleBot = (botId: string) => {
    enhancedAiBotService.toggleBot(botId);
    const updatedBots = enhancedAiBotService.getAllBots();
    setBots(updatedBots);
  };

  const activeBots = bots.filter(bot => bot.status === 'active');
  const totalReturn = bots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0) / bots.length;
  const totalTrades = bots.reduce((sum, bot) => sum + bot.performance.trades, 0);
  const avgWinRate = bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Trading Bot Command Center</h2>
          <p className="text-muted-foreground">Manage and monitor your 20+ pre-configured trading bots</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {activeBots.length} Active Bots
        </Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Combined Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(0)}%</p>
              </div>
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots.length}/{bots.length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Bots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setFilterStatus('all');
              setFilterRisk('all');
              setSearchTerm('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBots.map((bot) => (
          <Card key={bot.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight">{bot.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {bot.strategy.replace('-', ' ')}
                  </p>
                </div>
                <Badge 
                  variant={bot.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {bot.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {bot.riskLevel} risk
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {bot.model.split('/')[1]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className={`text-sm font-bold ${bot.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Return</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bot.performance.winRate}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-sm font-bold">{bot.performance.trades}</p>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bot.performance.sharpeRatio?.toFixed(2) || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Sharpe</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                  <div className={`w-2 h-2 rounded-full ${bot.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span>{bot.status === 'active' ? 'Running' : 'Paused'}</span>
                  {bot.status === 'active' && <TrendingUp className="h-3 w-3 text-green-500 ml-auto" />}
                </div>

                {/* Controls */}
                <div className="flex gap-1">
                  <Button
                    variant={bot.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => toggleBot(bot.id)}
                  >
                    {bot.status === 'active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBots.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Bots Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAiBotDashboard;
