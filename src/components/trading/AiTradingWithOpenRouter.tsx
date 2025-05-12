
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { TrendingUp, TrendingDown, Pause, Bot, LineChart, Brain, AlertTriangle } from 'lucide-react';
import { getOpenRouterApiKey, OPENROUTER_MODELS, generateTradingAnalysis, generateTradingStrategy } from '@/services/openRouterService';
import { CoinOption } from '@/types/trading';
import CryptoSearch from '../CryptoSearch';
import OpenRouterApiKeyForm from '../OpenRouterApiKeyForm';

const timeframes = [
  { id: '5m', name: '5 Minutes' },
  { id: '15m', name: '15 Minutes' },
  { id: '1h', name: '1 Hour' },
  { id: '4h', name: '4 Hours' },
  { id: '1d', name: '1 Day' },
  { id: '1w', name: '1 Week' },
];

const riskLevels = [
  { id: 'low', name: 'Conservative', description: 'Lower risk, lower potential returns' },
  { id: 'medium', name: 'Balanced', description: 'Moderate risk and returns' },
  { id: 'high', name: 'Aggressive', description: 'Higher risk, higher potential returns' },
];

interface AnalysisResult {
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  targets?: { entry?: number; stop?: number; target?: number };
}

interface StrategyResult {
  name: string;
  description: string;
  indicators: string[];
  rulesBuy: string[];
  rulesSell: string[];
  riskManagement: string[];
  targetReturn: number;
}

const AiTradingWithOpenRouter: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedModel, setSelectedModel] = useState(OPENROUTER_MODELS[0].id);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('medium');
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  
  const [activeTab, setActiveTab] = useState('analysis');
  
  // Check if API key is available
  useEffect(() => {
    const apiKey = getOpenRouterApiKey();
    setHasApiKey(!!apiKey);
  }, []);
  
  const handleSelectCoin = (coin: CoinOption) => {
    setSelectedCoin(coin);
    setAnalysisResult(null);
    setStrategyResult(null);
  };
  
  const handleRunAnalysis = async () => {
    if (!selectedCoin) {
      toast({
        title: 'Error',
        description: 'Please select a cryptocurrency',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await generateTradingAnalysis(
        selectedCoin.id,
        selectedTimeframe,
        selectedModel
      );
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'There was an error generating the trading analysis',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleGenerateStrategy = async () => {
    if (!selectedCoin) {
      toast({
        title: 'Error',
        description: 'Please select a cryptocurrency',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingStrategy(true);
    setStrategyResult(null);
    
    try {
      const result = await generateTradingStrategy(
        selectedCoin.id,
        selectedRiskLevel,
        selectedTimeframe,
        selectedModel
      );
      
      setStrategyResult(result);
    } catch (error) {
      console.error('Strategy generation error:', error);
      toast({
        title: 'Strategy Generation Failed',
        description: 'There was an error generating the trading strategy',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingStrategy(false);
    }
  };
  
  if (!hasApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Trading with OpenRouter
          </CardTitle>
          <CardDescription>
            Connect to OpenRouter to use AI-powered trading analysis and strategy generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OpenRouterApiKeyForm />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered trading analysis and strategy generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Trading Analysis
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Strategy Generator
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Select Cryptocurrency</Label>
                <CryptoSearch onSelectCoin={handleSelectCoin} />
                {selectedCoin && (
                  <div className="flex items-center mt-2 text-sm">
                    <div>Selected: </div>
                    <div className="font-medium ml-1 flex items-center">
                      {selectedCoin.image && (
                        <img src={selectedCoin.image} className="h-4 w-4 mr-1" alt={selectedCoin.name} />
                      )}
                      {selectedCoin.name} ({selectedCoin.symbol})
                    </div>
                    <div className="ml-2 text-muted-foreground">
                      ${selectedCoin.price.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map(tf => (
                        <SelectItem key={tf.id} value={tf.id}>{tf.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPENROUTER_MODELS.map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <TabsContent value="analysis" className="m-0 mt-6">
              <div className="space-y-6">
                <Button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !selectedCoin}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <LineChart className="h-4 w-4" />
                      Generate Trading Analysis
                    </>
                  )}
                </Button>
                
                {analysisResult && (
                  <Card className={
                    analysisResult.recommendation === 'buy' 
                      ? 'border-green-500 dark:border-green-700'
                      : analysisResult.recommendation === 'sell'
                      ? 'border-red-500 dark:border-red-700'
                      : 'border-gray-500 dark:border-gray-700'
                  }>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {analysisResult.recommendation === 'buy' && (
                              <TrendingUp className="h-8 w-8 text-green-500" />
                            )}
                            {analysisResult.recommendation === 'sell' && (
                              <TrendingDown className="h-8 w-8 text-red-500" />
                            )}
                            {analysisResult.recommendation === 'hold' && (
                              <Pause className="h-8 w-8 text-gray-500" />
                            )}
                            <div>
                              <h3 className="text-xl font-bold capitalize">
                                {analysisResult.recommendation}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                {selectedCoin?.name} ({selectedCoin?.symbol}) - {
                                  timeframes.find(tf => tf.id === selectedTimeframe)?.name
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Confidence</div>
                            <div className="text-lg font-bold">
                              {(analysisResult.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Analysis</h4>
                          <p className="text-sm">{analysisResult.reasoning}</p>
                        </div>
                        
                        {analysisResult.targets && (
                          <div className="grid grid-cols-3 gap-2">
                            {analysisResult.targets.entry && (
                              <div className="border rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Entry Price</div>
                                <div className="font-medium">${analysisResult.targets.entry.toFixed(2)}</div>
                              </div>
                            )}
                            {analysisResult.targets.stop && (
                              <div className="border rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Stop Loss</div>
                                <div className="font-medium">${analysisResult.targets.stop.toFixed(2)}</div>
                              </div>
                            )}
                            {analysisResult.targets.target && (
                              <div className="border rounded-md p-2">
                                <div className="text-xs text-muted-foreground">Target Price</div>
                                <div className="font-medium">${analysisResult.targets.target.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-2">
                          <div>Generated with {OPENROUTER_MODELS.find(m => m.id === selectedModel)?.name}</div>
                          <div>
                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <div>This is AI-generated analysis for informational purposes only. Not financial advice.</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="m-0 mt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Risk Level</Label>
                    <RadioGroup 
                      value={selectedRiskLevel} 
                      onValueChange={setSelectedRiskLevel}
                      className="grid grid-cols-3 gap-2"
                    >
                      {riskLevels.map((level) => (
                        <div key={level.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={level.id} id={`risk-${level.id}`} />
                          <Label htmlFor={`risk-${level.id}`} className="cursor-pointer">
                            {level.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-sm text-muted-foreground">
                      {riskLevels.find(level => level.id === selectedRiskLevel)?.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleGenerateStrategy}
                    disabled={isGeneratingStrategy || !selectedCoin}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingStrategy ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Generate Trading Strategy
                      </>
                    )}
                  </Button>
                </div>
                
                {strategyResult && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>{strategyResult.name}</CardTitle>
                      <CardDescription>{strategyResult.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Technical Indicators</h4>
                        <div className="flex flex-wrap gap-1">
                          {strategyResult.indicators.map((indicator, idx) => (
                            <div 
                              key={idx} 
                              className="bg-muted text-sm rounded-md px-2 py-1"
                            >
                              {indicator}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Buy Rules</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {strategyResult.rulesBuy.map((rule, idx) => (
                              <li key={idx}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Sell Rules</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {strategyResult.rulesSell.map((rule, idx) => (
                              <li key={idx}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Risk Management</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {strategyResult.riskManagement.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Expected Monthly Return: </span>
                          <span className="font-medium text-green-500">
                            +{strategyResult.targetReturn}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {riskLevels.find(level => level.id === selectedRiskLevel)?.name} Risk
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground border-t">
                      Generated for {selectedCoin?.name} ({selectedCoin?.symbol}) on {
                        timeframes.find(tf => tf.id === selectedTimeframe)?.name
                      } timeframe
                    </CardFooter>
                  </Card>
                )}
                
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <div>This is an AI-generated strategy for educational purposes. Test thoroughly before using.</div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingWithOpenRouter;
