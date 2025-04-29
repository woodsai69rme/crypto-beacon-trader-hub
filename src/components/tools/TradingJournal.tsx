
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookText, Plus, Tag, Calendar, Search, Filter, ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TradingJournal = () => {
  const [activeView, setActiveView] = useState("entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [newEntry, setNewEntry] = useState({
    pair: "BTC/USD",
    type: "buy",
    date: new Date().toISOString().split("T")[0],
    entryPrice: "",
    exitPrice: "",
    size: "",
    pnl: "",
    tags: [],
    notes: "",
    sentiment: "neutral",
    strategy: "",
    success: null,
  });
  
  // Sample journal entries
  const [entries, setEntries] = useState([
    {
      id: "entry-1",
      date: "2023-04-22T14:23:00Z",
      pair: "BTC/USD",
      type: "buy",
      entryPrice: 60420,
      exitPrice: 63150,
      size: 0.15,
      pnl: 409.5,
      pnlPercent: 4.5,
      tags: ["breakout", "momentum"],
      notes: "Entered after price broke above key resistance. Strong volume confirmed the breakout. Took profit at predetermined target.",
      sentiment: "bullish",
      strategy: "Breakout",
      success: true,
    },
    {
      id: "entry-2",
      date: "2023-04-20T09:15:00Z",
      pair: "ETH/USD",
      type: "sell",
      entryPrice: 3120,
      exitPrice: 2980,
      size: 2.5,
      pnl: 350,
      pnlPercent: 4.5,
      tags: ["swing", "overbought"],
      notes: "Shorted at resistance zone with RSI overbought. Market showed signs of exhaustion. Covered at support.",
      sentiment: "bearish",
      strategy: "Mean Reversion",
      success: true,
    },
    {
      id: "entry-3",
      date: "2023-04-18T11:30:00Z",
      pair: "BTC/USD",
      type: "buy",
      entryPrice: 61200,
      exitPrice: 59800,
      size: 0.1,
      pnl: -140,
      pnlPercent: -2.3,
      tags: ["support", "dip-buy"],
      notes: "Bought at support level, but support broke down. Stopped out quickly when price action turned bearish.",
      sentiment: "bullish",
      strategy: "Support/Resistance",
      success: false,
    },
  ]);
  
  // Add new journal entry
  const handleAddEntry = () => {
    const pnlValue = newEntry.type === "buy"
      ? (parseFloat(newEntry.exitPrice) - parseFloat(newEntry.entryPrice)) * parseFloat(newEntry.size)
      : (parseFloat(newEntry.entryPrice) - parseFloat(newEntry.exitPrice)) * parseFloat(newEntry.size);
    
    const pnlPercent = newEntry.type === "buy"
      ? ((parseFloat(newEntry.exitPrice) - parseFloat(newEntry.entryPrice)) / parseFloat(newEntry.entryPrice)) * 100
      : ((parseFloat(newEntry.entryPrice) - parseFloat(newEntry.exitPrice)) / parseFloat(newEntry.entryPrice)) * 100;
    
    const newEntryData = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      pair: newEntry.pair,
      type: newEntry.type,
      entryPrice: parseFloat(newEntry.entryPrice),
      exitPrice: parseFloat(newEntry.exitPrice),
      size: parseFloat(newEntry.size),
      pnl: pnlValue,
      pnlPercent,
      tags: newEntry.tags,
      notes: newEntry.notes,
      sentiment: newEntry.sentiment,
      strategy: newEntry.strategy,
      success: pnlValue > 0,
    };
    
    setEntries([newEntryData, ...entries]);
    setShowForm(false);
    setNewEntry({
      pair: "BTC/USD",
      type: "buy",
      date: new Date().toISOString().split("T")[0],
      entryPrice: "",
      exitPrice: "",
      size: "",
      pnl: "",
      tags: [],
      notes: "",
      sentiment: "neutral",
      strategy: "",
      success: null,
    });
  };
  
  // Calculate journal stats
  const calculateStats = () => {
    const totalTrades = entries.length;
    const winningTrades = entries.filter(entry => entry.pnl > 0).length;
    const losingTrades = entries.filter(entry => entry.pnl < 0).length;
    
    const totalProfit = entries.reduce((acc, entry) => acc + entry.pnl, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const averageWin = winningTrades > 0
      ? entries.filter(entry => entry.pnl > 0).reduce((acc, entry) => acc + entry.pnl, 0) / winningTrades
      : 0;
    
    const averageLoss = losingTrades > 0
      ? Math.abs(entries.filter(entry => entry.pnl < 0).reduce((acc, entry) => acc + entry.pnl, 0) / losingTrades)
      : 0;
    
    const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      totalProfit,
      winRate,
      averageWin,
      averageLoss,
      riskRewardRatio,
    };
  };
  
  const stats = calculateStats();
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookText className="h-5 w-5 text-primary" />
              Trading Journal
            </CardTitle>
            <CardDescription>
              Record and analyze your trades to improve your strategy
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-xs h-9 px-3"
              onClick={() => setActiveView("entries")}
            >
              Entries
            </Button>
            <Button
              variant="outline"
              className="text-xs h-9 px-3"
              onClick={() => setActiveView("stats")}
            >
              Statistics
            </Button>
            <Button 
              className="text-xs h-9 px-3"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Entry
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {showForm && (
          <Card className="mb-6 border border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">New Journal Entry</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Pair</label>
                  <Select 
                    value={newEntry.pair}
                    onValueChange={value => setNewEntry({...newEntry, pair: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                      <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                      <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                      <SelectItem value="BNB/USD">BNB/USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trade Type</label>
                  <Select
                    value={newEntry.type}
                    onValueChange={value => setNewEntry({...newEntry, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy/Long</SelectItem>
                      <SelectItem value="sell">Sell/Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Strategy</label>
                  <Select
                    value={newEntry.strategy}
                    onValueChange={value => setNewEntry({...newEntry, strategy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakout">Breakout</SelectItem>
                      <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                      <SelectItem value="Trend Following">Trend Following</SelectItem>
                      <SelectItem value="Support/Resistance">Support/Resistance</SelectItem>
                      <SelectItem value="Scalping">Scalping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Price</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.entryPrice}
                    onChange={e => setNewEntry({...newEntry, entryPrice: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exit Price</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.exitPrice}
                    onChange={e => setNewEntry({...newEntry, exitPrice: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position Size</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.size}
                    onChange={e => setNewEntry({...newEntry, size: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Select
                  value={newEntry.tags[0] || ""}
                  onValueChange={value => setNewEntry({...newEntry, tags: [value]})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="resistance">Resistance</SelectItem>
                    <SelectItem value="swing">Swing</SelectItem>
                    <SelectItem value="scalp">Scalp</SelectItem>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="reversal">Reversal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="What was your trading thesis? What went right or wrong?"
                  value={newEntry.notes}
                  onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Market Sentiment</label>
                <Select
                  value={newEntry.sentiment}
                  onValueChange={value => setNewEntry({...newEntry, sentiment: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Market sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullish">Bullish</SelectItem>
                    <SelectItem value="bearish">Bearish</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntry}>
                  Add Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeView === "entries" ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search journal entries..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="sm:w-[120px] gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entry/Exit</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Success</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell>{entry.pair}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === "buy" ? "default" : "destructive"}>
                          {entry.type === "buy" ? "LONG" : "SHORT"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs flex flex-col gap-1">
                          <span>${entry.entryPrice}</span>
                          <span>${entry.exitPrice}</span>
                        </div>
                      </TableCell>
                      <TableCell>{entry.size}</TableCell>
                      <TableCell className={entry.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                        <div className="flex flex-col">
                          <span>{formatCurrency(entry.pnl)}</span>
                          <span className="text-xs">({entry.pnlPercent.toFixed(2)}%)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.success ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BookText className="h-10 w-10 mb-2" />
                <p>No journal entries yet. Add your first trade!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
                <div className="text-2xl font-bold">{stats.totalTrades}</div>
              </div>
              
              <div className="bg-green-500/10 p-4 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-green-500">
                  {stats.winRate.toFixed(1)}%
                </div>
              </div>
              
              <div className={`p-4 rounded-md ${stats.totalProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
                <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatCurrency(stats.totalProfit)}
                </div>
              </div>
              
              <div className="bg-blue-500/10 p-4 rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Risk/Reward</div>
                <div className="text-2xl font-bold text-blue-500">
                  1:{stats.riskRewardRatio.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/10 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Trade Performance</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Winning Trades</span>
                      <span className="text-green-500">{stats.winningTrades}</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.winningTrades / stats.totalTrades) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Losing Trades</span>
                      <span className="text-red-500">{stats.losingTrades}</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${(stats.losingTrades / stats.totalTrades) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Win</span>
                    <span className="text-green-500">{formatCurrency(stats.averageWin)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Average Loss</span>
                    <span className="text-red-500">{formatCurrency(stats.averageLoss)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Largest Win</span>
                    <span className="text-green-500">
                      {formatCurrency(Math.max(...entries.map(e => e.pnl > 0 ? e.pnl : 0)))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Largest Loss</span>
                    <span className="text-red-500">
                      {formatCurrency(Math.min(...entries.map(e => e.pnl)))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/10 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Strategy Performance</h3>
                
                <div className="space-y-3">
                  {["Breakout", "Mean Reversion", "Trend Following", "Support/Resistance", "Scalping"]
                    .map(strategy => {
                      const strategyEntries = entries.filter(e => e.strategy === strategy);
                      const wins = strategyEntries.filter(e => e.pnl > 0).length;
                      const total = strategyEntries.length;
                      const winRate = total > 0 ? (wins / total) * 100 : 0;
                      
                      return (
                        <div key={strategy}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{strategy}</span>
                            <span>
                              {total > 0 ? `${wins}/${total} (${winRate.toFixed(1)}%)` : "No trades"}
                            </span>
                          </div>
                          {total > 0 && (
                            <div className="w-full bg-muted h-2 rounded-full">
                              <div
                                className={`h-2 rounded-full ${winRate >= 50 ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: `${winRate}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View Detailed Analysis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingJournal;
