
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionModel {
  id: string;
  name: string;
  type: 'lstm' | 'transformer' | 'ensemble' | 'gpt';
  accuracy: number;
  timeframe: string;
  lastUpdated: string;
  status: 'active' | 'training' | 'inactive';
}

interface PricePrediction {
  timestamp: string;
  price: number;
  confidence: number;
  model: string;
}

const AdvancedPricePredictionModels: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const models: PredictionModel[] = [
    {
      id: 'lstm',
      name: 'LSTM Neural Network',
      type: 'lstm',
      accuracy: 78.5,
      timeframe: '7 days',
      lastUpdated: '2 hours ago',
      status: 'active'
    },
    {
      id: 'transformer',
      name: 'Transformer Model',
      type: 'transformer',
      accuracy: 82.3,
      timeframe: '24 hours',
      lastUpdated: '30 minutes ago',
      status: 'active'
    },
    {
      id: 'ensemble',
      name: 'Ensemble Model',
      type: 'ensemble',
      accuracy: 85.7,
      timeframe: '3 days',
      lastUpdated: '15 minutes ago',
      status: 'active'
    },
    {
      id: 'gpt',
      name: 'GPT-4 Analysis',
      type: 'gpt',
      accuracy: 73.2,
      timeframe: '1 day',
      lastUpdated: '1 hour ago',
      status: 'training'
    }
  ];

  const mockPredictionData: PricePrediction[] = [
    { timestamp: '2024-01-01', price: 45000, confidence: 85, model: 'ensemble' },
    { timestamp: '2024-01-02', price: 46200, confidence: 83, model: 'ensemble' },
    { timestamp: '2024-01-03', price: 47500, confidence: 81, model: 'ensemble' },
    { timestamp: '2024-01-04', price: 46800, confidence: 79, model: 'ensemble' },
    { timestamp: '2024-01-05', price: 48200, confidence: 82, model: 'ensemble' },
    { timestamp: '2024-01-06', price: 49100, confidence: 84, model: 'ensemble' },
    { timestamp: '2024-01-07', price: 50300, confidence: 86, model: 'ensemble' }
  ];

  const generatePredictions = async () => {
    setIsLoading(true);
    
    // Simulate ML model prediction
    setTimeout(() => {
      setPredictions(mockPredictionData);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    generatePredictions();
  }, [selectedCoin, selectedModel]);

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'lstm': return <Brain className="h-4 w-4" />;
      case 'transformer': return <Zap className="h-4 w-4" />;
      case 'ensemble': return <Target className="h-4 w-4" />;
      case 'gpt': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Advanced Price Prediction Models
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="predictions">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions" className="space-y-6">
            <div className="flex gap-4">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={generatePredictions} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Predictions'}
              </Button>
            </div>
            
            {predictions.length > 0 && (
              <div className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Current Price</div>
                      <div className="text-2xl font-bold">${predictions[0]?.price.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">7-Day Target</div>
                      <div className="text-2xl font-bold text-green-500">
                        ${predictions[predictions.length - 1]?.price.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="text-2xl font-bold">
                        {predictions[predictions.length - 1]?.confidence}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="models" className="space-y-4">
            {models.map(model => (
              <Card key={model.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getModelIcon(model.type)}
                      <div>
                        <div className="font-semibold">{model.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.timeframe} • Updated {model.lastUpdated}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                        <div className="font-semibold">{model.accuracy}%</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                          {model.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {models.map(model => (
                      <div key={model.id} className="flex justify-between items-center">
                        <span className="text-sm">{model.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={model.accuracy} className="w-20 h-2" />
                          <span className="text-sm font-medium">{model.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Mean Absolute Error</span>
                    <span className="font-medium">$142.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Root Mean Square Error</span>
                    <span className="font-medium">$238.20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">R² Score</span>
                    <span className="font-medium">0.857</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Directional Accuracy</span>
                    <span className="font-medium">78.3%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedPricePredictionModels;
