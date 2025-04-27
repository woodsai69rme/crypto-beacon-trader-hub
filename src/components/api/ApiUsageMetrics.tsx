
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CoinOption } from "@/types/trading";
import { BarChart, LineChart } from "lucide-react";

interface ApiUsageMetricsProps {
  coinPrices?: CoinOption[];
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ coinPrices = [] }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
            <CardDescription>Coinbase API Usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,458 / 10,000</div>
            <Progress value={14.58} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">14.58% of daily limit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
            <CardDescription>Binance API Usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,753 / 12,000</div>
            <Progress value={22.94} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">22.94% of daily limit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
            <CardDescription>CoinGecko API Usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87 / 100</div>
            <Progress value={87} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1 text-amber-500">87% of daily limit</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium">API Usage History</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </div>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2">
              {[45, 62, 78, 52, 93, 86, 78].map((value, i) => (
                <div
                  key={i}
                  className="bg-primary/90 rounded-t w-full"
                  style={{ height: `${value}%` }}
                >
                  <div className="h-full w-full hover:bg-primary/100 transition-colors"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium">API Distribution</CardTitle>
              <CardDescription>By endpoint type</CardDescription>
            </div>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <div>Market Data</div>
                  <div>42%</div>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <div>Price Updates</div>
                  <div>28%</div>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <div>Historical Data</div>
                  <div>15%</div>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <div>Trading Execution</div>
                  <div>10%</div>
                </div>
                <Progress value={10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <div>Account Data</div>
                  <div>5%</div>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Real-time Data Statistics</CardTitle>
          <CardDescription>Data usage for cryptocurrency price updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Active Connections</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monitored Coins</div>
                <div className="text-2xl font-bold">{coinPrices?.length || 0}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Update Frequency</div>
                <div className="text-2xl font-bold">5s</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Data Points Today</div>
                <div className="text-2xl font-bold">53.2K</div>
              </div>
            </div>
            
            {coinPrices && coinPrices.length > 0 && (
              <div className="border rounded-md mt-4">
                <div className="grid grid-cols-4 bg-muted/50 p-2 text-sm font-medium">
                  <div>Coin</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Change</div>
                  <div className="text-right">Updates</div>
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {coinPrices.map((coin) => (
                    <div key={coin.id} className="grid grid-cols-4 p-2 border-t">
                      <div className="font-medium">{coin.symbol}</div>
                      <div className="text-right">${coin.price.toFixed(2)}</div>
                      <div className="text-right">
                        {(coin.priceChange || 0) > 0 ? (
                          <span className="text-green-500">+{(coin.changePercent || 0).toFixed(2)}%</span>
                        ) : (
                          <span className="text-red-500">{(coin.changePercent || 0).toFixed(2)}%</span>
                        )}
                      </div>
                      <div className="text-right text-muted-foreground">{Math.floor(Math.random() * 100) + 50}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiUsageMetrics;
