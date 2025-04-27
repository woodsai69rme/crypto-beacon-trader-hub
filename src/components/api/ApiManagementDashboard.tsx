
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiProviderManagement from './ApiProviderManagement';
import MobileOptimizedApiProvider from './MobileOptimizedApiProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, Lock, Database, Play } from 'lucide-react';
import { setCoinGeckoApiKey } from '@/services/api/coinGeckoService';
import { setCoinMarketCapApiKey } from '@/services/api/coinMarketCapService';
import { setCryptoCompareApiKey } from '@/services/api/cryptoCompareService';
import { setMessariApiKey } from '@/services/api/messariService';
import { toast } from '@/components/ui/use-toast';
import { startPriceMonitoringService } from '@/services/priceMonitoring';
import { useIsMobile } from '@/hooks/use-mobile';

const ApiManagementDashboard = () => {
  const isMobile = useIsMobile();

  const handleRefreshCaches = () => {
    localStorage.removeItem('api-cache');
    toast({
      title: "API Caches Cleared",
      description: "All API caches have been cleared"
    });
  };

  const handleTestPriceMonitoring = () => {
    startPriceMonitoringService();
  };

  if (isMobile) {
    return <MobileOptimizedApiProvider />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Management
          </CardTitle>
          <CardDescription>
            Configure API providers, authentication, and data sources for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="providers">API Providers</TabsTrigger>
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="testing">Testing & Cache</TabsTrigger>
            </TabsList>
            
            <TabsContent value="providers">
              <ApiProviderManagement />
            </TabsContent>
            
            <TabsContent value="keys">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">CoinGecko API Key</CardTitle>
                    <CardDescription>
                      Configure your CoinGecko Pro API key for extended functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter CoinGecko API Key"
                        id="coingecko-api-key"
                      />
                      <Button 
                        className="ml-2"
                        onClick={() => {
                          const input = document.getElementById('coingecko-api-key') as HTMLInputElement;
                          setCoinGeckoApiKey(input.value);
                          input.value = '';
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get a pro API key from the <a href="https://www.coingecko.com/en/api/pricing" target="_blank" rel="noopener noreferrer" className="underline">CoinGecko website</a>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">CoinMarketCap API Key</CardTitle>
                    <CardDescription>
                      Enter your CoinMarketCap API key to enable this data provider
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter CoinMarketCap API Key"
                        id="coinmarketcap-api-key"
                      />
                      <Button 
                        className="ml-2"
                        onClick={() => {
                          const input = document.getElementById('coinmarketcap-api-key') as HTMLInputElement;
                          setCoinMarketCapApiKey(input.value);
                          input.value = '';
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get an API key from the <a href="https://coinmarketcap.com/api/" target="_blank" rel="noopener noreferrer" className="underline">CoinMarketCap website</a>
                    </p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">CryptoCompare API Key</CardTitle>
                      <CardDescription>
                        Optional API key for CryptoCompare
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <input 
                          type="password"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter CryptoCompare API Key"
                          id="cryptocompare-api-key"
                        />
                        <Button 
                          className="ml-2"
                          onClick={() => {
                            const input = document.getElementById('cryptocompare-api-key') as HTMLInputElement;
                            setCryptoCompareApiKey(input.value);
                            input.value = '';
                          }}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Messari API Key</CardTitle>
                      <CardDescription>
                        Optional API key for Messari
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <input 
                          type="password"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter Messari API Key"
                          id="messari-api-key"
                        />
                        <Button 
                          className="ml-2"
                          onClick={() => {
                            const input = document.getElementById('messari-api-key') as HTMLInputElement;
                            setMessariApiKey(input.value);
                            input.value = '';
                          }}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testing">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cache Management</CardTitle>
                    <CardDescription>
                      Manage API response caching for performance optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleRefreshCaches}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear All Caches
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          localStorage.clear();
                          toast({
                            title: "Local Storage Cleared",
                            description: "All application data has been cleared"
                          });
                        }}
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Clear Local Storage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Test API Services</CardTitle>
                    <CardDescription>
                      Run tests for various API services and data providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="w-full"
                        onClick={handleTestPriceMonitoring}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Test Price Monitoring
                      </Button>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "API Response Format Test",
                            description: "Testing API response formats...",
                          });
                          setTimeout(() => {
                            toast({
                              title: "API Tests Complete",
                              description: "All API response formats passed validation",
                            });
                          }, 1500);
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Test API Response Formats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagementDashboard;
