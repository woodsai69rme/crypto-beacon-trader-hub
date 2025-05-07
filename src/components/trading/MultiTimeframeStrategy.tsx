
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BarChart3, Layers, Settings2, Play } from 'lucide-react';
import { tradingTimeframes } from "./types/timeframes";

const MultiTimeframeStrategy: React.FC = () => {
  const [selectedPrimaryTimeframe, setSelectedPrimaryTimeframe] = useState<string>("1d");
  const [selectedSecondaryTimeframe, setSelectedSecondaryTimeframe] = useState<string>("4h");
  const [selectedTertiaryTimeframe, setSelectedTertiaryTimeframe] = useState<string>("1h");
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const handleRunStrategy = () => {
    setIsRunning(true);
    
    toast({
      title: "Multi-Timeframe Strategy Activated",
      description: `Running analysis on ${selectedPrimaryTimeframe}, ${selectedSecondaryTimeframe}, and ${selectedTertiaryTimeframe} timeframes`,
    });
    
    // Simulate strategy execution
    setTimeout(() => {
      setIsRunning(false);
      
      toast({
        title: "Multi-Timeframe Analysis Complete",
        description: "The analysis has identified potential trading opportunities",
      });
    }, 3000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          Multi-Timeframe Strategy
        </CardTitle>
        <CardDescription>
          Analyze and trade using multiple timeframes for more reliable signals
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="configure">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configure">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Strategy Configuration</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Timeframe (Trend)</label>
                    <Select value={selectedPrimaryTimeframe} onValueChange={setSelectedPrimaryTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingTimeframes.filter(tf => ["4h", "1d", "1w"].includes(tf.id)).map(timeframe => (
                          <SelectItem key={timeframe.id} value={timeframe.id}>{timeframe.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The primary timeframe identifies the overall trend direction
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary Timeframe (Entry)</label>
                    <Select value={selectedSecondaryTimeframe} onValueChange={setSelectedSecondaryTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingTimeframes.filter(tf => ["15m", "1h", "4h"].includes(tf.id)).map(timeframe => (
                          <SelectItem key={timeframe.id} value={timeframe.id}>{timeframe.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The secondary timeframe identifies potential entry points
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tertiary Timeframe (Timing)</label>
                    <Select value={selectedTertiaryTimeframe} onValueChange={setSelectedTertiaryTimeframe}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingTimeframes.filter(tf => ["1m", "5m", "15m"].includes(tf.id)).map(timeframe => (
                          <SelectItem key={timeframe.id} value={timeframe.id}>{timeframe.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      The tertiary timeframe helps fine-tune entry and exit timing
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Strategy Logic</h3>
                <div className="bg-muted p-4 rounded-md text-sm">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Identify trend direction on {tradingTimeframes.find(tf => tf.id === selectedPrimaryTimeframe)?.label} timeframe</li>
                    <li>Confirm trend with indicators on {tradingTimeframes.find(tf => tf.id === selectedSecondaryTimeframe)?.label} timeframe</li>
                    <li>Enter trade when {tradingTimeframes.find(tf => tf.id === selectedTertiaryTimeframe)?.label} timeframe shows alignment</li>
                    <li>Exit when timeframes show divergence or take profit targets are hit</li>
                  </ol>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleRunStrategy}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>Running Analysis...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Multi-Timeframe Analysis
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Analysis Results</h3>
              
              {isRunning ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4">Analyzing multiple timeframes...</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Run the analysis to see results</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Strategy Settings</h3>
              <div className="text-center py-12">
                <Settings2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Advanced settings coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiTimeframeStrategy;
