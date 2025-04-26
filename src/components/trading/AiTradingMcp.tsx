import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import McpServerList, { McpServerConfig } from "./McpServerList";
import ModelConfigPanel from "./ModelConfigPanel";
import TradingControls from "./TradingControls";
import ServerStatus from "./ServerStatus";
import DisconnectedState from "./DisconnectedState";

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
    try {
      const updatedServers = mcpServers.map(server => 
        server.id === serverId 
          ? { ...server, status: "connecting" as const } 
          : server
      );
      
      setMcpServers(updatedServers);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to MCP server. Please try again.",
        variant: "destructive",
      });
    }
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
  
  const startTraining = async () => {
    if (!activeServerId) {
      toast({
        title: "No Server Connected",
        description: "Please connect to an MCP server first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
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
    } catch (error) {
      setIsTraining(false);
      toast({
        title: "Training Failed",
        description: "An error occurred during model training",
        variant: "destructive",
      });
    }
  };
  
  const toggleTrading = () => {
    setIsTradingActive(!isTradingActive);
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
        <McpServerList 
          servers={mcpServers}
          onConnectServer={connectToServer}
          onDisconnectServer={disconnectServer}
          onAddServer={addMcpServer}
        />
        
        {activeServerId ? (
          <>
            <ModelConfigPanel 
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              activeServerId={activeServerId}
              isTraining={isTraining}
              trainingProgress={trainingProgress}
              startTraining={startTraining}
            />
            
            <TradingControls 
              isTradingActive={isTradingActive}
              toggleTrading={toggleTrading}
              activeServerId={activeServerId}
            />
          </>
        ) : (
          <DisconnectedState />
        )}
      </CardContent>
      
      <CardFooter>
        <ServerStatus activeServerId={activeServerId} />
      </CardFooter>
    </Card>
  );
};

export default AiTradingMcp;
