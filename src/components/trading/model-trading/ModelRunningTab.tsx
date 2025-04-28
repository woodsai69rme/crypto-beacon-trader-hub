
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Brain, Play, StopCircle } from "lucide-react";
import { ModelRunningTabProps } from "./ModelRunningTabProps";
import { Spinner } from "@/components/ui/spinner";

export const ModelRunningTab: React.FC<ModelRunningTabProps> = ({ model, onDisconnect }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [symbol, setSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1d");
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  const runModel = () => {
    setIsRunning(true);
    setResult(null);
    setConfidence(null);
    
    // Simulate API call to the model endpoint
    setTimeout(() => {
      const predictions = ["bullish", "bearish", "neutral"];
      const randomPrediction = predictions[Math.floor(Math.random() * 3)];
      const randomConfidence = Math.round(Math.random() * 85 + 15); // 15-100%
      
      setResult(randomPrediction);
      setConfidence(randomConfidence);
      setIsRunning(false);
      
      toast({
        title: "Model Prediction Complete",
        description: `${symbol} ${timeframe} prediction: ${randomPrediction.toUpperCase()} (${randomConfidence}% confidence)`
      });
    }, 2500);
  };
  
  const getResultClass = () => {
    if (!result) return "";
    if (result === "bullish") return "text-green-500";
    if (result === "bearish") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              {model.name}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {model.description || "Connected to your local AI model"}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symbol</label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                  <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={runModel}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Running Model...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Prediction
                </>
              )}
            </Button>
            
            {(result || isRunning) && (
              <div className="p-4 border rounded-md">
                <div className="text-sm font-medium mb-2">Model Output:</div>
                {isRunning ? (
                  <div className="flex items-center justify-center p-4">
                    <Spinner size="md" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold mb-1 capitalize">
                      <span className={getResultClass()}>{result}</span>
                    </div>
                    {confidence !== null && (
                      <div className="text-sm text-muted-foreground">
                        Confidence: {confidence}%
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onDisconnect(model.id)}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Disconnect Model
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
