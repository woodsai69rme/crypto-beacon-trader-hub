import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart4, TrendingUp, Eye } from "lucide-react";
import { ExtendedTradingTimeframe, tradingTimeframes } from './types/timeframes';

interface MultiTimeframeStrategyProps {
  onStrategyChange?: (strategy: any) => void;
}

const MultiTimeframeStrategy: React.FC<MultiTimeframeStrategyProps> = ({ onStrategyChange }) => {
  // Define possible timeframes
  const availableTimeframes: ExtendedTradingTimeframe[] = tradingTimeframes;

  // State for selected timeframes
  const [selectedTimeframes, setSelectedTimeframes] = useState<{
    primary: string;
    secondary: string;
    confirmation: string;
  }>({
    primary: "1h",
    secondary: "4h",
    confirmation: "1d",
  });

  // State for alert settings
  const [alertSettings, setAlertSettings] = useState({
    enableNotifications: true,
    conflictWarnings: true,
    divergenceAlerts: true,
  });

  // Active tab
  const [activeTab, setActiveTab] = useState('setup');

  // Handle timeframe changes
  const handlePrimaryTimeframeChange = (value: string) => {
    setSelectedTimeframes(prev => ({
      ...prev,
      primary: value
    }));
  };

  const handleSecondaryTimeframeChange = (value: string) => {
    setSelectedTimeframes(prev => ({
      ...prev,
      secondary: value
    }));
  };

  const handleConfirmationTimeframeChange = (value: string) => {
    setSelectedTimeframes(prev => ({
      ...prev,
      confirmation: value
    }));
  };

  // Get timeframe object by value
  const getTimeframeByValue = (value: string): ExtendedTradingTimeframe | undefined => {
    return availableTimeframes.find(tf => tf.value === value);
  };

  const primaryTimeframe = getTimeframeByValue(selectedTimeframes.primary);
  const secondaryTimeframe = getTimeframeByValue(selectedTimeframes.secondary);
  const confirmationTimeframe = getTimeframeByValue(selectedTimeframes.confirmation);

  // Handle apply strategy
  const handleApplyStrategy = () => {
    if (onStrategyChange) {
      onStrategyChange({
        timeframes: selectedTimeframes,
        alerts: alertSettings,
        type: 'multi-timeframe',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Multi-Timeframe Strategy
        </CardTitle>
        <CardDescription>
          Configure a trading strategy that analyzes multiple timeframes for stronger signals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Primary Timeframe</h3>
                    <p className="text-sm text-muted-foreground">
                      Main timeframe for trade execution signals
                    </p>
                  </div>
                  <Select value={selectedTimeframes.primary} onValueChange={handlePrimaryTimeframeChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeframes.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Secondary Timeframe</h3>
                    <p className="text-sm text-muted-foreground">
                      Trend direction and context
                    </p>
                  </div>
                  <Select value={selectedTimeframes.secondary} onValueChange={handleSecondaryTimeframeChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeframes.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Confirmation Timeframe</h3>
                    <p className="text-sm text-muted-foreground">
                      Confirmation of larger trends for better accuracy
                    </p>
                  </div>
                  <Select value={selectedTimeframes.confirmation} onValueChange={handleConfirmationTimeframeChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeframes.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Strategy Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="font-medium w-32">Primary (Entry):</div>
                    <div>{primaryTimeframe?.label}</div>
                    <div className="text-xs text-muted-foreground">{primaryTimeframe?.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium w-32">Secondary (Trend):</div>
                    <div>{secondaryTimeframe?.label}</div>
                    <div className="text-xs text-muted-foreground">{secondaryTimeframe?.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium w-32">Confirmation:</div>
                    <div>{confirmationTimeframe?.label}</div>
                    <div className="text-xs text-muted-foreground">{confirmationTimeframe?.description}</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/5 border border-amber-100/20 p-4 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500">Strategy Notes</p>
                  <p>For best results, keep timeframes in ascending order, with primary being the smallest and confirmation being the largest.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Signal Generation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  How signals are generated across multiple timeframes
                </p>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="text-center border border-dashed border-border p-2 rounded-md min-w-[100px]">
                      <div className="text-sm font-medium">Primary</div>
                      <div className="text-xs text-muted-foreground">{primaryTimeframe?.value}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center border border-dashed border-border p-2 rounded-md min-w-[100px]">
                      <div className="text-sm font-medium">Secondary</div>
                      <div className="text-xs text-muted-foreground">{secondaryTimeframe?.value}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center border border-dashed border-border p-2 rounded-md min-w-[100px]">
                      <div className="text-sm font-medium">Confirmation</div>
                      <div className="text-xs text-muted-foreground">{confirmationTimeframe?.value}</div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <h4 className="font-medium">Buy Signal Requirements:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Primary: Price above 20 EMA, RSI {'>'}{'>'} 50</li>
                      <li>Secondary: Uptrend confirmed (higher highs & lows)</li>
                      <li>Confirmation: Above 100 SMA, no bearish patterns</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <h4 className="font-medium">Sell Signal Requirements:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Primary: Price below 20 EMA, RSI {'<'} 50</li>
                      <li>Secondary: Downtrend confirmed (lower highs & lows)</li>
                      <li>Confirmation: Below 100 SMA or bearish patterns</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <h4 className="font-medium">Signal Strength:</h4>
                    <div className="space-y-2 text-sm">
                      <p>Signal strength is calculated based on alignment across timeframes:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Strong (3/3): All timeframes aligned</li>
                        <li>Moderate (2/3): Primary + one other timeframe aligned</li>
                        <li>Weak (1/3): Only primary timeframe signal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when signals are generated
                    </p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={alertSettings.enableNotifications}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="conflict-warnings">Conflict Warnings</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts when timeframes give conflicting signals
                    </p>
                  </div>
                  <Switch 
                    id="conflict-warnings"
                    checked={alertSettings.conflictWarnings}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, conflictWarnings: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="divergence-alerts">Divergence Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of RSI divergences on any timeframe
                    </p>
                  </div>
                  <Switch 
                    id="divergence-alerts"
                    checked={alertSettings.divergenceAlerts}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, divergenceAlerts: checked }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleApplyStrategy} className="ml-auto">Apply Strategy</Button>
      </CardFooter>
    </Card>
  );
};

export default MultiTimeframeStrategy;
