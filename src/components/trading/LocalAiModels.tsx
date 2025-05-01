
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { LocalModel, ModelListProps } from "@/types/trading";
import ModelList from './model-trading/ModelList';
import { Bot, Check, Github, HardDrive, Plus, Share2, Terminal, Upload, Workflow } from 'lucide-react';

const LocalAiModels: React.FC = () => {
  const [activeTab, setActiveTab] = useState("installed");
  const [isImporting, setIsImporting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  const form = useForm({
    defaultValues: {
      name: "",
      endpoint: "",
      description: "",
      type: "prediction" as const,
      requiresAuth: false,
    },
  });

  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "model-1",
      name: "Price Predictor LLM",
      endpoint: "http://localhost:8000/predict",
      type: "prediction",
      isConnected: true,
      lastUsed: "2023-04-15T14:23:45Z",
      description: "A specialized large language model trained on financial data to predict cryptocurrency prices",
      performance: {
        accuracy: 78.4,
        returns: 12.5,
        sharpeRatio: 1.67,
        maxDrawdown: 8.2
      }
    },
    {
      id: "model-2",
      name: "Sentiment Analyzer",
      endpoint: "http://localhost:8001/analyze",
      type: "sentiment",
      isConnected: false,
      lastUsed: "2023-04-10T09:17:22Z",
      description: "Analyzes news and social media sentiment for market impact assessment"
    },
    {
      id: "model-3",
      name: "Trading Bot Alpha",
      endpoint: "http://localhost:8002/trade",
      type: "trading",
      isConnected: true,
      lastUsed: "2023-04-16T18:05:11Z",
      description: "An automated trading system using LSTM neural networks",
      performance: {
        accuracy: 81.2,
        returns: 18.7,
        sharpeRatio: 1.92,
        maxDrawdown: 7.5
      }
    },
    {
      id: "model-4",
      name: "Market Pattern Analyzer",
      endpoint: "http://localhost:8003/analyze",
      type: "analysis",
      isConnected: false,
      description: "Identifies recurring patterns in market data using advanced pattern recognition algorithms"
    }
  ]);

  const handleModelConnect = (model: LocalModel) => {
    setIsConnecting(true);
    // Simulate API connection
    setTimeout(() => {
      setModels(models.map(m => 
        m.id === model.id ? { ...m, isConnected: true } : m
      ));
      setIsConnecting(false);
      toast({
        title: "Model Connected",
        description: `Successfully connected to ${model.name}`,
      });
    }, 1500);
  };

  const handleModelDisconnect = (modelId: string) => {
    setModels(models.map(m => 
      m.id === modelId ? { ...m, isConnected: false } : m
    ));
    toast({
      title: "Model Disconnected",
      description: `Model has been disconnected`,
    });
  };

  const handleModelSelect = (model: LocalModel) => {
    toast({
      title: "Model Selected",
      description: `You selected ${model.name}`,
    });
  };

  const handleImportSubmit = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Model Imported",
        description: "The AI model has been successfully imported",
      });
      setActiveTab("installed");
    }, 2000);
  };

  const onSubmit = (data: any) => {
    const newModel: LocalModel = {
      id: `model-${models.length + 1}`,
      name: data.name,
      endpoint: data.endpoint,
      type: data.type,
      isConnected: false,
      description: data.description,
    };
    
    setModels([...models, newModel]);
    form.reset();
    
    toast({
      title: "Model Added",
      description: "Your AI model has been added to the dashboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Local AI Models
        </CardTitle>
        <CardDescription>
          Connect and manage your local AI models for trading and analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="installed">Installed Models</TabsTrigger>
            <TabsTrigger value="add">Add Model</TabsTrigger>
            <TabsTrigger value="import">Import Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="installed" className="space-y-6">
            <ModelList 
              models={models}
              onSelect={handleModelSelect}
              onConnect={handleModelConnect}
              onDisconnect={handleModelDisconnect}
            />
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setActiveTab("add")} className="w-full max-w-md">
                <Plus className="h-4 w-4 mr-2" />
                Add New Model
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="http://localhost:8000/predict" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL where your model's API is running
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Type</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <Button
                          type="button"
                          variant={field.value === "prediction" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => form.setValue("type", "prediction")}
                        >
                          <Terminal className="h-6 w-6" />
                          <div className="text-sm">Prediction</div>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "sentiment" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => form.setValue("type", "sentiment")}
                        >
                          <Workflow className="h-6 w-6" />
                          <div className="text-sm">Sentiment</div>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "trading" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => form.setValue("type", "trading")}
                        >
                          <Bot className="h-6 w-6" />
                          <div className="text-sm">Trading</div>
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "analysis" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => form.setValue("type", "analysis")}
                        >
                          <Share2 className="h-6 w-6" />
                          <div className="text-sm">Analysis</div>
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe what this model does..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Authentication Required</FormLabel>
                        <FormDescription>
                          Enable if your model requires an API key
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("installed")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Model
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-6">
              <div className="grid gap-6">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your model file here, or click to browse
                  </p>
                  <Input type="file" className="hidden" />
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Or import from repository</div>
                  <div className="flex gap-2">
                    <Input placeholder="GitHub repository URL" className="flex-1" />
                    <Button variant="outline">
                      <Github className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Or import from local path</div>
                  <div className="flex gap-2">
                    <Input placeholder="C:/Users/username/models/my_model" className="flex-1" />
                    <Button variant="outline">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">API Authentication (if required)</div>
                <InputOTP maxLength={12} value={apiKey} onChange={setApiKey}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={8} />
                    <InputOTPSlot index={9} />
                    <InputOTPSlot index={10} />
                    <InputOTPSlot index={11} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab("installed")}>
                  Cancel
                </Button>
                <Button onClick={handleImportSubmit} disabled={isImporting}>
                  {isImporting ? (
                    <>Importing...</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Import Model
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
