
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Wallet, Plus } from "lucide-react";
import AIStrategySuggestions from './AIStrategySuggestions';
import { mockCoinData, mockAIStrategies } from '@/utils/mockData';

const portfolioValue = 38745.92;

const CryptoTradingDashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Portfolio Overview</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Funds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                24h Change
                <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-end gap-1">
                <div className="text-2xl font-bold">+$1,458.63</div>
                <div className="text-sm text-green-500 mb-1">+3.91%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Available Funds</div>
              <div className="text-2xl font-bold">$6,249.37</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                Overall Return
                <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-end gap-1">
                <div className="text-2xl font-bold">+$12,358.49</div>
                <div className="text-sm text-green-500 mb-1">+46.8%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Top Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCoinData.slice(0, 3).map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {coin.image && (
                        <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                          <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div>${coin.price.toLocaleString()}</div>
                      <div className={`text-xs ${coin.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.changePercent > 0 ? '+' : ''}{coin.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full text-sm">
                  View All Holdings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Trades</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Buy BTC</div>
                      <div className="text-sm text-muted-foreground">Today, 10:45 AM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>+0.0345 BTC</div>
                    <div className="text-sm text-muted-foreground">$1,752.32</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <ArrowUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Sell ETH</div>
                      <div className="text-sm text-muted-foreground">Yesterday, 2:30 PM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>-1.5 ETH</div>
                    <div className="text-sm text-muted-foreground">$3,745.20</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Buy SOL</div>
                      <div className="text-sm text-muted-foreground">Feb 11, 9:15 AM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>+22.5 SOL</div>
                    <div className="text-sm text-muted-foreground">$3,242.68</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <ArrowDown className="h-5 w-5 mb-1" />
                  <span>Buy</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <ArrowUp className="h-5 w-5 mb-1" />
                  <span>Sell</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <Wallet className="h-5 w-5 mb-1" />
                  <span>Deposit</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7 7l-7-7l7-7" />
                  </svg>
                  <span>Withdraw</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AIStrategySuggestions strategies={mockAIStrategies} />
        </div>
      </div>
    </div>
  );
};

export default CryptoTradingDashboard;
