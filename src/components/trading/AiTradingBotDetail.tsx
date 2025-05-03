
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ArrowLeft, RefreshCw, Play, Pause, Settings2, Code, LineChart, History } from "lucide-react";
import { AiBotTradingProps } from "@/types/trading";
import { Separator } from "@/components/ui/separator";

interface ExtendedAiBotTradingProps extends AiBotTradingProps {
  strategyId?: string;
  strategyName?: string;
}

const AiTradingBotDetail: React.FC<ExtendedAiBotTradingProps> = ({ strategyId = "bot-1", strategyName = "Mean Reversion ETH" }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {strategyName}
          </CardTitle>
        </div>
        <div className="flex items-center justify-between">
          <CardDescription>
            Bot ID: {strategyId} • Strategy: Mean Reversion • Timeframe: 4h
          </CardDescription>
          <Badge variant={Math.random() > 0.5 ? "default" : "secondary"}>
            {Math.random() > 0.5 ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Start Bot
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Configure
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Return</span>
                  <span className="font-medium text-crypto-green">+8.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profit Factor</span>
                  <span className="font-medium">1.7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-medium">1.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Max Drawdown</span>
                  <span className="font-medium text-crypto-red">-3.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Signal</span>
                  <span className="font-medium text-crypto-green">Buy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Signal Time</span>
                  <span className="font-medium">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Position</span>
                  <span className="font-medium">Long</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Entry Price</span>
                  <span className="font-medium">$3,412.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Position P/L</span>
                  <span className="font-medium text-crypto-green">+$28.75 (+0.8%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Position Size</span>
                  <span className="font-medium">2% of Account</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stop Loss</span>
                  <span className="font-medium">2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Take Profit</span>
                  <span className="font-medium">4.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trailing Stop</span>
                  <span className="font-medium">Enabled (1.2%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="chart">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="chart" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Trade History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Strategy Code</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <Card>
              <CardContent className="p-6">
                <div className="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Performance chart will appear here</p>
                    <Button variant="outline" className="mt-4">Load Chart</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trades">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No recent trades to show</p>
                  <p className="text-sm text-muted-foreground">Trade history will appear here once the bot executes trades</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Strategy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Settings2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Settings editor will appear here</p>
                  <Button variant="outline" className="mt-4">Open Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Strategy Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Strategy code editor will appear here</p>
                  <Button variant="outline" className="mt-4">View Code</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
