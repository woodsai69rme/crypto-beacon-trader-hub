
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Server, Bot, Cpu, AlertCircle, Check, RefreshCw, ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

interface McpServerConfig {
  id: string;
  name: string;
  endpoint: string;
  status: "online" | "offline" | "connecting";
  type: "prediction" | "inference" | "optimization";
  lastSync?: string;
}

const AiTradingMcp = () => {
  const [mcpServers, setMcpServers] = useState<McpServerConfig[]>([
    {
      id: "mcp-1",
      name: "MCP Primary Node",
      endpoint: "http://localhost:5000",
      status: "offline",
      type: "prediction"
    },
    {
      id: "mcp-2",
      name: "MCP Analysis Server",
      endpoint: "http://localhost:5001",
      status: "offline",
      type: "inference"
    }
  ]);
  
  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTradingActive, setIsTradingActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState("lstm-attention");
  const [timeframe, setTimeframe] = useState("4h");
  
  const connectToServer = async (serverId: string) => {
    // In a real app, this would attempt to connect to the MCP server
    const updatedServers = mcpServers.map(server => 
      server.id === serverId 
        ? { ...server, status: "connecting" as const } 
        : server
    );
    
    setMcpServers(updatedServers);
    
    // Simulate connection delay
    setTimeout(() => {
      const finalServers = mcpServers.map(server => 
        server.id === serverId 
          ? { 
              ...server, 
              status: "online" as const,
              lastSync: new Date().toISOString()
            } 
          : server
      );
      
      setMcpServers(finalServers);
      setActiveServerId(serverId);
      
      toast({
        title: "MCP Server Connected",
        description: `Successfully connected to ${finalServers.find(s => s.id === serverId)?.name}`,
      });
    }, 1500);
  };
  
  const disconnectServer = (serverId: string) => {
    const updatedServers = mcpServers.map(server => 
      server.id === serverId 
        ? { ...server, status: "offline" as const } 
        : server
    );
    
    setMcpServers(updatedServers);
    
    if (activeServerId === serverId) {
      setActiveServerId(null);
    }
    
    toast({
      title: "MCP Server Disconnected",
      description: `Disconnected from ${updatedServers.find(s => s.id === serverId)?.name}`,
    });
  };
  
  const addMcpServer = () => {
    const newServer: McpServerConfig = {
      id: `mcp-${mcpServers.length + 1}`,
      name: `MCP Server ${mcpServers.length + 1}`,
      endpoint: "http://localhost:5002",
      status: "offline",
      type: "prediction"
    };
    
    setMcpServers([...mcpServers, newServer]);
  };
  
  const startTraining = () => {
    if (!activeServerId) {
      toast({
        title: "No Server Connected",
        description: "Please connect to an MCP server first",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          toast({
            title: "Model Training Complete",
            description: "Your AI trading model has been successfully trained",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 800);
  };
  
  const toggleTrading = () => {
    if (!activeServerId) {
      toast({
        title: "No Server Connected",
        description: "Please connect to an MCP server before activating trading",
        variant: "destructive",
      });
      return;
    }
    
    setIsTradingActive(!isTradingActive);
    
    toast({
      title: isTradingActive ? "Trading Stopped" : "Trading Started",
      description: isTradingActive 
        ? "AI trading has been deactivated" 
        : "AI trading is now active and will execute trades based on your settings",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading with MCP Servers
        </CardTitle>
        <CardDescription>
          Connect to local MCP servers for advanced AI-powered trading strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">MCP Server Network</h3>
          <div className="space-y-3">
            {mcpServers.map(server => (
              <div key={server.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{server.name}</span>
                    <Badge 
                      variant={
                        server.status === "online" ? "default" : 
                        server.status === "connecting" ? "outline" : "secondary"
                      }
                      className={
                        server.status === "online" ? "bg-green-500" :
                        server.status === "connecting" ? "border-amber-500 text-amber-500" : ""
                      }
                    >
                      {server.status}
                    </Badge>
                  </div>
                  
                  {server.status === "offline" ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => connectToServer(server.id)}
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => disconnectServer(server.id)}
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 text-sm text-muted-foreground">
                  <div>Endpoint: {server.endpoint}</div>
                  <div>Type: {server.type}</div>
                  {server.lastSync && (
                    <div className="col-span-2 mt-1">
                      Last sync: {new Date(server.lastSync).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={addMcpServer} className="w-full">
              Add MCP Server
            </Button>
          </div>
        </div>
        
        {activeServerId && (
          <>
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">AI Model Configuration</h3>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="model">Trading Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lstm-attention">LSTM + Attention</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                      <SelectItem value="cnn-lstm">CNN-LSTM Hybrid</SelectItem>
                      <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timeframe">Trading Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="advanced-params" className="cursor-pointer">Advanced Parameters</Label>
                  <Switch id="advanced-params" />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">Training & Execution</h3>
              
              {isTraining ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Training in progress...</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              ) : (
                <Button onClick={startTraining} className="w-full">
                  <Cpu className="mr-2 h-4 w-4" />
                  Train Model
                </Button>
              )}
              
              <div className="mt-4 p-4 border border-dashed rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">Automated Trading</div>
                  <div className="text-sm text-muted-foreground">
                    Let AI execute trades based on market signals
                  </div>
                </div>
                <Switch 
                  checked={isTradingActive} 
                  onCheckedChange={toggleTrading}
                  className={isTradingActive ? "bg-green-500" : ""}
                />
              </div>
            </div>
            
            {isTradingActive && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Live Trading Activity</h3>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 bg-background rounded">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      <span>BTC/USD</span>
                    </div>
                    <div className="text-green-500">Buy @ $61,245.32</div>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-background rounded">
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                      <span>ETH/USD</span>
                    </div>
                    <div className="text-red-500">Sell @ $3,010.45</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-3">
                    Last signal: 2 minutes ago
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {!activeServerId && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <div className="font-medium text-lg mb-1">No MCP Server Connected</div>
            <div className="text-muted-foreground mb-4">
              Please connect to an MCP server to start using AI trading features
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t flex justify-between pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {activeServerId ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span>Connected to MCP network</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span>No MCP connection</span>
            </>
          )}
        </div>
        <div>
          MCP Protocol v2.1
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiTradingMcp;
