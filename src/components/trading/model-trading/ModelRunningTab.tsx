
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Coins, BarChart3, Database, Power, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ModelRunningTabProps } from "./ModelRunningTabProps";

export const ModelRunningTab: React.FC<ModelRunningTabProps> = ({
  model,
  onDisconnect,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("predict");
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predictionInput, setPredictionInput] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1d");
  
  const handleRunPrediction = async () => {
    if (!predictionInput) {
      toast({
        title: "Input Required",
        description: "Please enter a coin symbol or ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to model endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock prediction result
      const mockResult = {
        coinId: predictionInput.toLowerCase(),
        prediction: {
          direction: Math.random() > 0.5 ? "up" : "down",
          confidence: (0.6 + Math.random() * 0.3).toFixed(2),
          priceTarget: model.type === "prediction" ? 
            (predictionInput.toLowerCase() === "btc" ? 65000 + Math.random() * 5000 : 3000 + Math.random() * 500).toFixed(2) : 
            undefined,
          sentiment: model.type === "sentiment" ? 
            (Math.random() > 0.6 ? "positive" : Math.random() > 0.4 ? "neutral" : "negative") : 
            undefined,
          timeframe: selectedTimeframe,
          timestamp: new Date().toISOString(),
        }
      };
      
      setPredictionResult(mockResult);
      
      toast({
        title: "Prediction Complete",
        description: `${model.name} has analyzed ${predictionInput.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Failed to get prediction from AI model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    onDisconnect(model.id);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-primary">
              {model.name}
              <span className="ml-2 text-sm bg-green-500/10 text-green-500 px-2 py-0.5 rounded">
                Active
              </span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <Power className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            <p>
              <strong>Type:</strong> {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
            </p>
            {model.endpoint && (
              <p>
                <strong>Endpoint:</strong> {model.endpoint}
              </p>
            )}
            {model.lastUsed && (
              <p>
                <strong>Last Used:</strong> {new Date(model.lastUsed).toLocaleString()}
              </p>
            )}
            {model.description && (
              <p>
                <strong>Description:</strong> {model.description}
              </p>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="predict">Predict</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predict" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="coin-input">Coin Symbol or ID</Label>
                  <Input 
                    id="coin-input" 
                    placeholder="BTC, ETH, etc." 
                    value={predictionInput}
                    onChange={(e) => setPredictionInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <select
                    id="timeframe"
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleRunPrediction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Run Prediction
                  </>
                )}
              </Button>
              
              {predictionResult && (
                <Card className="mt-4 border-2 border-primary/20">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Prediction Results for {predictionResult.coinId.toUpperCase()}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Direction:</span>
                        <span className={`font-medium ${
                          predictionResult.prediction.direction === 'up' 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {predictionResult.prediction.direction.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">{(parseFloat(predictionResult.prediction.confidence) * 100).toFixed(0)}%</span>
                      </div>
                      {predictionResult.prediction.priceTarget && (
                        <div className="flex justify-between">
                          <span>Price Target:</span>
                          <span className="font-medium">${predictionResult.prediction.priceTarget}</span>
                        </div>
                      )}
                      {predictionResult.prediction.sentiment && (
                        <div className="flex justify-between">
                          <span>Sentiment:</span>
                          <span className={`font-medium ${
                            predictionResult.prediction.sentiment === 'positive' 
                              ? 'text-green-500' 
                              : predictionResult.prediction.sentiment === 'negative'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                          }`}>
                            {predictionResult.prediction.sentiment.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Timeframe:</span>
                        <span className="font-medium">{predictionResult.prediction.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="font-medium">{new Date(predictionResult.prediction.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-run predictions</Label>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Send notifications</Label>
                  <input type="checkbox" className="toggle toggle-primary" checked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log predictions</Label>
                  <input type="checkbox" className="toggle toggle-primary" checked />
                </div>
                <div>
                  <Label>API timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h4 className="text-lg font-medium mb-1">No Training Data Available</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This model hasn't been trained with custom data yet.
                </p>
                <Button variant="outline" className="mr-2">
                  <Coins className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="ghost">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelRunningTab;
