
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, Globe, Zap, Server } from 'lucide-react';

const ApiDocs: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          API Documentation
        </CardTitle>
        <CardDescription>
          Reference documentation for APIs used in the trading platform
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="crypto">
              <Globe className="h-4 w-4 mr-2" />
              Crypto Data APIs
            </TabsTrigger>
            <TabsTrigger value="exchange">
              <Zap className="h-4 w-4 mr-2" />
              Exchange APIs
            </TabsTrigger>
            <TabsTrigger value="websocket">
              <Server className="h-4 w-4 mr-2" />
              WebSocket APIs
            </TabsTrigger>
            <TabsTrigger value="usage">
              <FileText className="h-4 w-4 mr-2" />
              API Integration Guide
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="space-y-6 py-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Cryptocurrency Data APIs</h2>
              <p className="text-muted-foreground mb-4">
                Documentation for the cryptocurrency data providers integrated into the platform.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium border-b pb-2">CoinGecko API</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium">Base URL</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded">https://api.coingecko.com/api/v3</code>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Key Endpoints</h4>
                      <div className="bg-muted p-4 rounded-md mt-2 space-y-4">
                        <div>
                          <h5 className="text-sm font-medium">/coins/markets</h5>
                          <p className="text-xs text-muted-foreground mt-1">Get list of coins with market data</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium">/coins/{'{id}'}/market_chart</h5>
                          <p className="text-xs text-muted-foreground mt-1">Get historical market data</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exchange" className="space-y-6 py-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Exchange APIs</h2>
              <p className="text-muted-foreground mb-4">
                Documentation for the exchange APIs integrated into the platform.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium border-b pb-2">Binance API</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-medium">Base URL</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded">https://api.binance.com/api/v3</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="websocket" className="space-y-6 py-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">WebSocket APIs</h2>
              <p className="text-muted-foreground mb-4">
                Documentation for real-time WebSocket APIs integrated into the platform.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6 py-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">API Integration Guide</h2>
              <p className="text-muted-foreground mb-4">
                Learn how to effectively integrate and use the various APIs in the platform.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiDocs;
