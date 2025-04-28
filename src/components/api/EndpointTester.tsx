
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Play, Download, Copy, Trash } from "lucide-react";

interface EndpointTesterProps {
  selectedService?: string;
  onServiceSelect?: (service: string) => void;
}

const EndpointTester: React.FC<EndpointTesterProps> = ({ 
  selectedService = 'CoinGecko',
  onServiceSelect
}) => {
  const [method, setMethod] = useState<string>("GET");
  const [endpoint, setEndpoint] = useState<string>("/coins/markets");
  const [params, setParams] = useState<string>('{"vs_currency": "usd", "per_page": 10, "page": 1}');
  const [headers, setHeaders] = useState<string>('{}');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{
    service: string;
    method: string;
    endpoint: string;
    params: string;
    status?: number;
    timestamp: string;
  }>>([]);

  const baseUrls: Record<string, string> = {
    'CoinGecko': 'https://api.coingecko.com/api/v3',
    'CryptoCompare': 'https://min-api.cryptocompare.com/data',
    'TradingView': 'https://scanner.tradingview.com/crypto/scan',
    'Hyblock': 'https://api.hyblock.capital'
  };
  
  const constructUrl = () => {
    const base = baseUrls[selectedService] || '';
    return `${base}${endpoint}`;
  };
  
  const handleSend = async () => {
    setIsLoading(true);
    setResponse('');
    
    try {
      // Parse params and headers
      const parsedParams = JSON.parse(params);
      const parsedHeaders = JSON.parse(headers);
      
      const fullUrl = constructUrl();
      
      // For demonstration purposes, we'll simulate the API call
      // In a real app, this would make an actual API request
      
      // Mock response based on the API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mockResponse: any;
      
      if (selectedService === 'CoinGecko' && endpoint.includes('/coins/markets')) {
        mockResponse = [
          {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            current_price: 61245.32,
            market_cap: 1180000000000,
            market_cap_rank: 1
          },
          {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            current_price: 3010.45,
            market_cap: 360000000000,
            market_cap_rank: 2
          }
        ];
      } else {
        mockResponse = {
          status: {
            code: 200,
            message: "Success"
          },
          data: {
            result: "Sample response data for " + endpoint
          },
          timestamp: new Date().toISOString()
        };
      }
      
      const prettyResponse = JSON.stringify(mockResponse, null, 2);
      setResponse(prettyResponse);
      
      // Add to history
      setHistory(prev => [
        {
          service: selectedService,
          method,
          endpoint,
          params,
          status: 200,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9) // Keep only the last 10 items
      ]);
      
      toast({
        title: "Request Successful",
        description: `${method} request to ${endpoint} completed successfully`
      });
    } catch (error) {
      console.error("API test error:", error);
      setResponse(JSON.stringify({ error: "Failed to send request" }, null, 2));
      
      toast({
        title: "Request Failed",
        description: "Could not complete the API request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied to Clipboard",
      description: "Response has been copied to clipboard"
    });
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Request history has been cleared"
    });
  };
  
  const handleSelectHistoryItem = (item: any) => {
    setMethod(item.method);
    setEndpoint(item.endpoint);
    setParams(item.params);
    
    if (onServiceSelect && item.service !== selectedService) {
      onServiceSelect(item.service);
    }
    
    toast({
      title: "History Item Loaded",
      description: "Previous request has been loaded"
    });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="request">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Label htmlFor="service">Service</Label>
                <Select 
                  value={selectedService} 
                  onValueChange={(value) => onServiceSelect && onServiceSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CoinGecko">CoinGecko</SelectItem>
                    <SelectItem value="CryptoCompare">CryptoCompare</SelectItem>
                    <SelectItem value="TradingView">TradingView</SelectItem>
                    <SelectItem value="Hyblock">Hyblock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <Label htmlFor="method">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <Label htmlFor="base-url">Base URL</Label>
                <Input 
                  id="base-url" 
                  value={baseUrls[selectedService] || ''} 
                  disabled
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input 
                id="endpoint" 
                value={endpoint} 
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/coins/markets" 
              />
            </div>
            
            <div>
              <Label htmlFor="params">Parameters (JSON)</Label>
              <Textarea 
                id="params" 
                value={params} 
                onChange={(e) => setParams(e.target.value)}
                placeholder='{"vs_currency": "usd", "per_page": 10}'
                rows={4}
                className="font-mono text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="headers">Headers (JSON)</Label>
              <Textarea 
                id="headers" 
                value={headers} 
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Authorization": "Bearer YOUR_API_KEY"}'
                rows={2}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSend} 
                disabled={isLoading} 
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? "Sending Request..." : "Send Request"}
              </Button>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md text-xs">
              <div className="font-medium mb-1">Full URL:</div>
              <div className="font-mono break-all">{constructUrl()}</div>
            </div>
          </TabsContent>
          
          <TabsContent value="response">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Response</Label>
                {response && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyResponse}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Textarea 
                  value={response} 
                  readOnly 
                  rows={20}
                  placeholder="Response will appear here after sending a request"
                  className="font-mono text-sm"
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  disabled={!response}
                  onClick={() => {
                    const blob = new Blob([response], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedService}-${endpoint.replace(/\//g, '-')}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Request History</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                >
                  <Trash className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              
              {history.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="bg-muted/50 p-2 grid grid-cols-5 gap-2 text-xs font-medium">
                    <div>Service</div>
                    <div>Method</div>
                    <div>Endpoint</div>
                    <div>Status</div>
                    <div>Timestamp</div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-auto">
                    {history.map((item, index) => (
                      <div 
                        key={index}
                        className="p-2 grid grid-cols-5 gap-2 text-xs border-t hover:bg-muted/20 cursor-pointer"
                        onClick={() => handleSelectHistoryItem(item)}
                      >
                        <div>{item.service}</div>
                        <div>{item.method}</div>
                        <div className="truncate">{item.endpoint}</div>
                        <div>
                          <span className={item.status === 200 ? "text-green-600" : "text-red-600"}>
                            {item.status || "N/A"}
                          </span>
                        </div>
                        <div>{new Date(item.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No request history yet. Send requests to build history.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EndpointTester;
