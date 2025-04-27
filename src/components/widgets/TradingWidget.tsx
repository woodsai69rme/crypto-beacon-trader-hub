
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, Zap, TrendingUp } from "lucide-react";

export interface TradingWidgetProps {
  isCompact?: boolean;
}

const mockData = [
  { date: "Jan", btc: 29000, eth: 1500 },
  { date: "Feb", btc: 33000, eth: 1650 },
  { date: "Mar", btc: 44000, eth: 1800 },
  { date: "Apr", btc: 41000, eth: 1750 },
  { date: "May", btc: 37000, eth: 1900 },
  { date: "Jun", btc: 35000, eth: 2100 },
  { date: "Jul", btc: 42000, eth: 2300 },
  { date: "Aug", btc: 45000, eth: 2500 },
  { date: "Sep", btc: 56000, eth: 2900 },
  { date: "Oct", btc: 61000, eth: 3000 }
];

const TradingWidget: React.FC<TradingWidgetProps> = ({ isCompact = false }) => {
  return (
    <Card className={`w-full ${isCompact ? 'h-[300px]' : ''}`}>
      <CardHeader className={`${isCompact ? 'pb-2' : 'pb-4'}`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isCompact ? "Market Overview" : "Trading Overview"}
            </CardTitle>
            <CardDescription>
              {isCompact ? "Key market indicators" : "Market performance and trading metrics"}
            </CardDescription>
          </div>
          {!isCompact && (
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-1" /> Trade Now
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isCompact ? (
          <div className="space-y-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="btc" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border rounded-md">
                <div className="text-sm text-muted-foreground">BTC/USD</div>
                <div className="flex items-center">
                  <span className="text-lg font-medium">$61,245</span>
                  <span className="text-xs text-green-500 flex items-center ml-2">
                    <ArrowUp className="h-3 w-3 mr-0.5" /> 2.4%
                  </span>
                </div>
              </div>
              <div className="p-2 border rounded-md">
                <div className="text-sm text-muted-foreground">ETH/USD</div>
                <div className="flex items-center">
                  <span className="text-lg font-medium">$3,010</span>
                  <span className="text-xs text-red-500 flex items-center ml-2">
                    <ArrowDown className="h-3 w-3 mr-0.5" /> 0.8%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="btc" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="eth" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">BTC/USD</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">$61,245</span>
                  <span className="text-sm text-green-500 flex items-center ml-2">
                    <ArrowUp className="h-3 w-3 mr-0.5" /> 2.4%
                  </span>
                </div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">ETH/USD</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">$3,010</span>
                  <span className="text-sm text-red-500 flex items-center ml-2">
                    <ArrowDown className="h-3 w-3 mr-0.5" /> 0.8%
                  </span>
                </div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">SOL/USD</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">$142</span>
                  <span className="text-sm text-green-500 flex items-center ml-2">
                    <ArrowUp className="h-3 w-3 mr-0.5" /> 4.2%
                  </span>
                </div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">ADA/USD</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">$0.45</span>
                  <span className="text-sm text-red-500 flex items-center ml-2">
                    <ArrowDown className="h-3 w-3 mr-0.5" /> 1.3%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingWidget;
