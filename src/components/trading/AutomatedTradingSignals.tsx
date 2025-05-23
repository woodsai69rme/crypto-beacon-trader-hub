
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LineChart, RefreshCw, Zap, Bell, ArrowUpRight, ArrowDownRight, 
  Filter, CheckCircle2, AlertTriangle, CircleDollarSign, Lightbulb
} from "lucide-react";
import { useTrading } from '@/contexts/TradingContext';
import { generateTradingSignals } from '@/services/aiPortfolioService';
import { TradingSignal } from '@/types/trading';
import { formatDistanceToNow } from 'date-fns';

const AutomatedTradingSignals: React.FC = () => {
  const { toast } = useToast();
  const { activeAccount, addTrade } = useTrading();
  
  const [isLoading, setIsLoading] = useState(false);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Load signals on mount
  useEffect(() => {
    fetchTradingSignals();
  }, [activeAccount?.id]);
  
  const fetchTradingSignals = async () => {
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please select an active account to generate signals",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newSignals = await generateTradingSignals(activeAccount, {
        limit: 10,
        minConfidence: 70
      });
      
      setSignals(newSignals);
      
      if (newSignals.length === 0) {
        toast({
          title: "No Trading Signals",
          description: "No high-confidence signals were found at this time",
        });
      } else {
        toast({
          title: "Trading Signals Generated",
          description: `Found ${newSignals.length} signals for your portfolio`,
        });
      }
    } catch (error) {
      toast({
        title: "Error Generating Signals",
        description: error instanceof Error ? error.message : "Failed to generate trading signals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExecuteSignal = (signal: TradingSignal) => {
    if (!activeAccount) return;
    
    // Prepare trade from signal
    const amount = signal.type === 'buy' 
      ? (activeAccount.balance / signal.price) * 0.1 // 10% of available balance
      : 0.1; // Fixed amount for sell
      
    const price = signal.price;
    const total = amount * price;
    
    try {
      // Execute the trade
      addTrade({
        coinId: signal.coinId,
        coinName: signal.coinId.charAt(0).toUpperCase() + signal.coinId.slice(1),
        coinSymbol: signal.coinSymbol,
        type: signal.type,
        amount,
        price,
        totalValue: total,
        total,
        currency: activeAccount.currency as any,
        botGenerated: true,
        tags: ['ai-signal', `confidence-${signal.strength}`]
      });
      
      toast({
        title: "Signal Executed",
        description: `${signal.type === 'buy' ? 'Bought' : 'Sold'} ${amount.toFixed(4)} ${signal.coinSymbol} at ${price.toFixed(2)}`,
      });
      
      // Refresh signals after execution
      setTimeout(() => {
        fetchTradingSignals();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute the trade",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateAlert = (signal: TradingSignal) => {
    toast({
      title: "Alert Created",
      description: `You'll be notified of significant movements for ${signal.coinSymbol}`,
    });
  };
  
  const getFilteredSignals = () => {
    if (activeTab === 'all') return signals;
    return signals.filter(signal => signal.type === activeTab);
  };
  
  const getConfidenceBadgeColor = (strength: number) => {
    if (strength >= 85) return "bg-green-100 text-green-800";
    if (strength >= 70) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>Automated Trading Signals</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchTradingSignals} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          AI-generated trading signals based on market analysis and your portfolio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-2 pt-2 border-b">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All Signals</TabsTrigger>
              <TabsTrigger value="buy">Buy Signals</TabsTrigger>
              <TabsTrigger value="sell">Sell Signals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {getFilteredSignals().length > 0 ? (
              <div className="divide-y">
                {getFilteredSignals().map(signal => (
                  <div key={signal.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{signal.coinSymbol}</span>
                          <Badge 
                            className={`font-normal ${
                              signal.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {signal.type === 'buy' ? 'Buy' : 'Sell'}
                          </Badge>
                          <Badge variant="outline" className={getConfidenceBadgeColor(signal.strength)}>
                            {signal.strength}% Confidence
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(signal.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${signal.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-sm mb-3">{signal.reason}</div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-2 bg-muted/50 rounded text-center">
                        <div className="text-xs text-muted-foreground">Entry</div>
                        <div>${signal.suggestedActions.entry?.toFixed(2) || '-'}</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-center">
                        <div className="text-xs text-muted-foreground">Target</div>
                        <div>${signal.suggestedActions.target?.toFixed(2) || '-'}</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded text-center">
                        <div className="text-xs text-muted-foreground">Stop Loss</div>
                        <div>${signal.suggestedActions.stopLoss?.toFixed(2) || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleExecuteSignal(signal)}
                        className={signal.type === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                      >
                        {signal.type === 'buy' ? (
                          <>
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            Execute Buy
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                            Execute Sell
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCreateAlert(signal)}>
                        <Bell className="mr-1 h-4 w-4" />
                        Create Alert
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                        <LineChart className="mr-1 h-3 w-3" />
                        View Analysis
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                {isLoading ? (
                  <>
                    <RefreshCw className="h-10 w-10 text-muted-foreground mb-4 animate-spin" />
                    <p className="text-muted-foreground">Generating trading signals...</p>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No signals available at this time</p>
                    <Button className="mt-4" size="sm" onClick={fetchTradingSignals}>
                      Generate Signals
                    </Button>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomatedTradingSignals;
