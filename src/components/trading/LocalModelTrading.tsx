
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Server, AlertCircle } from "lucide-react";
import { ModelConnectionTab } from "./model-trading/ModelConnectionTab";
import { ModelGenerationTab } from "./model-trading/ModelGenerationTab";
import { ModelRunningTab } from "./model-trading/ModelRunningTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { LocalModel } from "./types";

const LocalModelTrading = () => {
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connect");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Local AI Trading
        </CardTitle>
        <CardDescription>
          Utilize your own AI models running locally for private and customized trading strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="connect">Connect Model</TabsTrigger>
            <TabsTrigger value="generate">Generate Strategy</TabsTrigger>
            <TabsTrigger value="run">Run Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <ModelConnectionTab onModelSelect={(model) => {
              setSelectedModel(model);
              setActiveTab("generate");
            }} />
          </TabsContent>
          
          <TabsContent value="generate">
            <ModelGenerationTab 
              selectedModel={selectedModel} 
              onBack={() => setActiveTab("connect")}
              onGenerate={() => setActiveTab("run")}
            />
          </TabsContent>
          
          <TabsContent value="run">
            <ModelRunningTab 
              selectedModel={selectedModel}
              onBack={() => setActiveTab("generate")}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between pt-4">
        <div className="text-xs text-muted-foreground">
          {selectedModel ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Connected to local model: {selectedModel.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span>No local model connected</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Local Model Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocalModelTrading;
