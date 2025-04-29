
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BookOpen,
  Brain,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Github,
  Info,
  LineChart,
  List,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AITradingStrategy } from "@/types/trading";

const AiTradingBots = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [activeStrategy, setActiveStrategy] = useState<AITradingStrategy | null>(null);
  const [runningBots, setRunningBots] = useState<AITradingStrategy[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);

  // Mock strategies
  const availableStrategies: AITradingStrategy[] = [
    {
      id: "trend-following-1",
      name: "TrendMaster AI",
      description: "Uses AI to identify and follow market trends with adaptive entry and exit points.",
      riskLevel: "medium",
      timeframe: "1D",
      type: "trend-following",
      parameters: {
        movingAverages: ["SMA-50", "EMA-21"],
        stopLoss: 5,
        takeProfit: 15,
      },
      tags: ["trend", "momentum", "popular"],
      performance: 12.4,
      creator: "CryptoLabs AI"
    },
    {
      id: "mean-reversion-1",
      name: "Volatility Stabilizer",
      description: "Identifies overbought and oversold conditions to capitalize on price reversions.",
      riskLevel: "low",
      timeframe: "4H",
      type: "mean-reversion",
      parameters: {
        rsi: { oversold: 30, overbought: 70 },
        bollingerBands: { std: 2 },
      },
      tags: ["mean-reversion", "volatility"],
      performance: 8.7,
      creator: "Quantum Trading"
    },
    {
      id: "breakout-detection-1",
      name: "BreakoutHunter Pro",
      description: "Detects volume-confirmed breakouts from consolidation patterns.",
      riskLevel: "high",
      timeframe: "1H",
      type: "breakout",
      parameters: {
        volumeThreshold: 1.5,
        consolidationPeriod: 14,
      },
      tags: ["breakout", "volume", "aggressive"],
      performance: 18.9,
      creator: "AlgoTraders Inc."
    },
  ];

  const handleActivateStrategy = (strategy: AITradingStrategy) => {
    setActiveStrategy(strategy);
  };

  const handleCreateBot = () => {
    if (!activeStrategy) return;

    setIsCreating(true);
    setCreationProgress(0);

    const interval = setInterval(() => {
      setCreationProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRunningBots((prev) => [...prev, activeStrategy]);
            setIsCreating(false);
            setActiveStrategy(null);
            setCreationProgress(0);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case "trend-following":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "mean-reversion":
        return <RefreshCw className="h-5 w-5 text-green-500" />;
      case "breakout":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "sentiment":
        return <Activity className="h-5 w-5 text-purple-500" />;
      case "machine-learning":
        return <BrainCircuit className="h-5 w-5 text-indigo-500" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500/80";
      case "medium":
        return "bg-yellow-500/80";
      case "high":
        return "bg-red-500/80";
      default:
        return "bg-blue-500/80";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            <CardTitle>AI Trading Bots</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            Beta Feature
          </Badge>
        </div>
        <CardDescription>
          Deploy AI-powered trading strategies that adapt to market conditions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="running">Running ({runningBots.length})</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 pt-4">
            {availableStrategies.map((strategy) => (
              <Card
                key={strategy.id}
                className={`transition-all hover:shadow-md ${
                  activeStrategy?.id === strategy.id ? "border-primary" : ""
                }`}
              >
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {strategy.type && getStrategyIcon(strategy.type)}
                      <CardTitle className="text-base">{strategy.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getRiskColor(
                          strategy.riskLevel
                        )} bg-opacity-15 text-foreground`}
                      >
                        {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {strategy.timeframe}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleActivateStrategy(strategy)}
                      >
                        {activeStrategy?.id === strategy.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {activeStrategy?.id === strategy.id && (
                  <>
                    <CardContent className="py-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        {strategy.description}
                      </p>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="text-xs font-medium">Performance</div>
                          <div className="flex items-center gap-2">
                            <LineChart className="h-4 w-4 text-muted-foreground" />
                            <div className="text-lg font-medium text-green-500">
                              +{strategy.performance?.toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Past 30 days (simulated)
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium">Details</div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {strategy.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-secondary/50 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground pt-1">
                            Created by {strategy.creator || "Unknown"}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="text-xs font-medium flex items-center gap-1">
                          <Settings className="h-3 w-3" /> Strategy Parameters
                        </div>
                        <div className="text-xs font-mono bg-muted/30 rounded p-2 overflow-x-auto">
                          <pre>{JSON.stringify(strategy.parameters, null, 2)}</pre>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-4">
                      <Button
                        className="w-full"
                        onClick={handleCreateBot}
                        disabled={isCreating}
                      >
                        {isCreating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Setting up your bot...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Deploy Trading Bot
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="running" className="space-y-4 pt-4">
            {runningBots.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Active Bots</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any AI trading bots running at the moment.
                  </p>
                  <Button
                    onClick={() => setActiveTab("available")}
                    variant="secondary"
                    size="sm"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Browse Available Strategies
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Render running bots
              runningBots.map((bot) => (
                <Card key={`running-${bot.id}`}>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {bot.type && getStrategyIcon(bot.type)}
                        <CardTitle className="text-base">{bot.name}</CardTitle>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Profit/Loss</p>
                        <p className="text-lg font-medium text-green-500">+$125.45</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Active Since</p>
                        <p className="text-sm">3 hours ago</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span>Performance</span>
                        <span className="text-green-500">+2.4%</span>
                      </div>
                      <Progress value={42} className="h-1" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" /> Configure
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        setRunningBots((prev) =>
                          prev.filter((strategy) => strategy.id !== bot.id)
                        )
                      }
                    >
                      Stop Bot
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="custom" className="pt-4">
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Custom AI strategy creation is under development. Stay tuned for updates!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                  <Button variant="secondary" size="sm" className="flex-1" disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href="https://github.com/crypto-trading-ai/roadmap"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Roadmap
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-4">
              <BookOpen className="h-4 w-4" />
              <AlertTitle>Developer Preview</AlertTitle>
              <AlertDescription className="text-sm">
                Advanced users can access our API documentation to create custom strategies
                using our Python SDK.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {isCreating && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Deploying AI trading bot...</span>
              <span>{creationProgress}%</span>
            </div>
            <Progress value={creationProgress} className="h-1" />
            <p className="text-xs text-muted-foreground">
              Initializing strategy parameters and connecting to pricing engine
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
