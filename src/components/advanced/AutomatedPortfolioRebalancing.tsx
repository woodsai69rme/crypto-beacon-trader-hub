
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Settings, TrendingUp, AlertTriangle } from "lucide-react";

interface RebalanceRule {
  id: string;
  name: string;
  type: 'threshold' | 'calendar' | 'volatility';
  enabled: boolean;
  settings: {
    threshold?: number;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    volatilityThreshold?: number;
  };
}

interface PortfolioAllocation {
  asset: string;
  symbol: string;
  target: number;
  current: number;
  deviation: number;
  value: number;
  needsRebalance: boolean;
}

const AutomatedPortfolioRebalancing: React.FC = () => {
  const [isRebalancingEnabled, setIsRebalancingEnabled] = useState(true);
  const [lastRebalance, setLastRebalance] = useState('2024-01-15T10:30:00Z');
  const [rebalanceRules, setRebalanceRules] = useState<RebalanceRule[]>([
    {
      id: '1',
      name: 'Threshold Rebalancing',
      type: 'threshold',
      enabled: true,
      settings: { threshold: 5 }
    },
    {
      id: '2',
      name: 'Monthly Rebalancing',
      type: 'calendar',
      enabled: false,
      settings: { frequency: 'monthly' }
    },
    {
      id: '3',
      name: 'Volatility-Based',
      type: 'volatility',
      enabled: false,
      settings: { volatilityThreshold: 20 }
    }
  ]);

  const portfolioAllocations: PortfolioAllocation[] = [
    {
      asset: 'Bitcoin',
      symbol: 'BTC',
      target: 40,
      current: 45.2,
      deviation: 5.2,
      value: 22600,
      needsRebalance: true
    },
    {
      asset: 'Ethereum',
      symbol: 'ETH',
      target: 30,
      current: 27.8,
      deviation: -2.2,
      value: 13900,
      needsRebalance: false
    },
    {
      asset: 'Solana',
      symbol: 'SOL',
      target: 15,
      current: 12.5,
      deviation: -2.5,
      value: 6250,
      needsRebalance: false
    },
    {
      asset: 'Cardano',
      symbol: 'ADA',
      target: 10,
      current: 9.8,
      deviation: -0.2,
      value: 4900,
      needsRebalance: false
    },
    {
      asset: 'Cash',
      symbol: 'USD',
      target: 5,
      current: 4.7,
      deviation: -0.3,
      value: 2350,
      needsRebalance: false
    }
  ];

  const executeRebalance = async () => {
    // Simulate rebalancing execution
    console.log('Executing portfolio rebalance...');
    setLastRebalance(new Date().toISOString());
  };

  const updateRule = (ruleId: string, updates: Partial<RebalanceRule>) => {
    setRebalanceRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const totalValue = portfolioAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
  const assetsNeedingRebalance = portfolioAllocations.filter(a => a.needsRebalance).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Automated Portfolio Rebalancing
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Auto-Rebalancing</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically maintain your target portfolio allocation
                </p>
              </div>
              <Switch
                checked={isRebalancingEnabled}
                onCheckedChange={setIsRebalancingEnabled}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Portfolio Value</div>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Last Rebalance</div>
                  <div className="text-lg font-semibold">
                    {new Date(lastRebalance).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Needs Rebalance</div>
                  <div className="text-2xl font-bold text-orange-500">
                    {assetsNeedingRebalance} assets
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {assetsNeedingRebalance > 0 && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold text-orange-800 dark:text-orange-200">
                      Portfolio Rebalancing Recommended
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    Your portfolio has drifted from target allocations. Consider rebalancing.
                  </p>
                  <Button onClick={executeRebalance} size="sm">
                    Execute Rebalance Now
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Allocations</h3>
              {portfolioAllocations.map(allocation => (
                <Card key={allocation.symbol}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold">{allocation.asset}</div>
                          <div className="text-sm text-muted-foreground">
                            ${allocation.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {allocation.needsRebalance && (
                          <Badge variant="destructive">Rebalance Needed</Badge>
                        )}
                        <div className="text-right">
                          <div className="font-semibold">{allocation.current}%</div>
                          <div className="text-sm text-muted-foreground">
                            Target: {allocation.target}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current vs Target</span>
                        <span className={allocation.deviation > 0 ? 'text-red-500' : 'text-green-500'}>
                          {allocation.deviation > 0 ? '+' : ''}{allocation.deviation.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={allocation.current} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rebalancing Rules</h3>
              
              {rebalanceRules.map(rule => (
                <Card key={rule.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.type === 'threshold' && `Trigger when deviation exceeds ${rule.settings.threshold}%`}
                          {rule.type === 'calendar' && `Rebalance ${rule.settings.frequency}`}
                          {rule.type === 'volatility' && `Trigger when volatility exceeds ${rule.settings.volatilityThreshold}%`}
                        </div>
                      </div>
                      
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {rule.type === 'threshold' && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium w-20">Threshold:</label>
                          <Input
                            type="number"
                            value={rule.settings.threshold}
                            onChange={(e) => updateRule(rule.id, {
                              settings: { ...rule.settings, threshold: Number(e.target.value) }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}
                      
                      {rule.type === 'calendar' && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium w-20">Frequency:</label>
                          <Select
                            value={rule.settings.frequency}
                            onValueChange={(frequency) => updateRule(rule.id, {
                              settings: { ...rule.settings, frequency: frequency as any }
                            })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {rule.type === 'volatility' && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium w-20">Volatility:</label>
                          <Input
                            type="number"
                            value={rule.settings.volatilityThreshold}
                            onChange={(e) => updateRule(rule.id, {
                              settings: { ...rule.settings, volatilityThreshold: Number(e.target.value) }
                            })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rebalancing History</h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Automatic Rebalance</div>
                      <div className="text-sm text-muted-foreground">January 15, 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-500">+2.3%</div>
                      <div className="text-sm text-muted-foreground">Portfolio return</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Manual Rebalance</div>
                      <div className="text-sm text-muted-foreground">December 28, 2023</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-500">+1.8%</div>
                      <div className="text-sm text-muted-foreground">Portfolio return</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Threshold Triggered</div>
                      <div className="text-sm text-muted-foreground">December 10, 2023</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-500">-0.5%</div>
                      <div className="text-sm text-muted-foreground">Portfolio return</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomatedPortfolioRebalancing;
