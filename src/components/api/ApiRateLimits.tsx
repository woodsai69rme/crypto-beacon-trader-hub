
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ApiRateLimits = () => {
  const exchangeLimits = [
    {
      exchange: "Binance",
      limits: [
        { name: "Weight-based 1m", current: 800, max: 1200, unit: "credits", interval: "1 minute" },
        { name: "Raw requests 1d", current: 15600, max: 100000, unit: "requests", interval: "1 day" },
        { name: "Orders 10s", current: 12, max: 50, unit: "orders", interval: "10 seconds" },
        { name: "Orders 1d", current: 432, max: 160000, unit: "orders", interval: "1 day" }
      ]
    },
    {
      exchange: "Coinbase",
      limits: [
        { name: "Public endpoints", current: 120, max: 250, unit: "requests", interval: "1 minute" },
        { name: "Private endpoints", current: 25, max: 180, unit: "requests", interval: "1 minute" },
        { name: "Market data", current: 4, max: 10, unit: "requests", interval: "1 second" }
      ]
    },
    {
      exchange: "Kraken",
      limits: [
        { name: "REST calls", current: 15, max: 15, unit: "calls", interval: "1 second", warning: true },
        { name: "REST tier 2", current: 20, max: 20, unit: "calls", interval: "10 seconds", warning: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Kraken API rate limits are at maximum capacity. Consider reducing request frequency.
        </AlertDescription>
      </Alert>
      
      {exchangeLimits.map((exchange) => (
        <Card key={exchange.exchange}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{exchange.exchange}</CardTitle>
            <CardDescription>API rate limits for {exchange.exchange}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exchange.limits.map((limit, i) => {
              const percentUsed = (limit.current / limit.max) * 100;
              let statusClass = "text-green-500";
              if (percentUsed > 90) {
                statusClass = "text-red-500";
              } else if (percentUsed > 70) {
                statusClass = "text-yellow-500";
              }
              
              return (
                <div key={`${exchange.exchange}-${i}`} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{limit.name}</div>
                      <div className="text-sm text-muted-foreground">Per {limit.interval}</div>
                    </div>
                    <div className={`text-right ${statusClass} font-medium`}>
                      {limit.current} / {limit.max} {limit.unit}
                    </div>
                  </div>
                  <Progress 
                    value={percentUsed} 
                    className={`h-2 ${
                      percentUsed > 90 ? "bg-red-100" : percentUsed > 70 ? "bg-yellow-100" : "bg-green-100"
                    }`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Rate Limit Management</CardTitle>
          <CardDescription>Strategies to avoid hitting API rate limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 border-b pb-4">
              <div className="bg-primary/10 text-primary rounded-full p-2">1</div>
              <div>
                <h3 className="font-medium">Implement caching</h3>
                <p className="text-sm text-muted-foreground">Cache responses for non-critical data to reduce redundant API calls</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-b pb-4">
              <div className="bg-primary/10 text-primary rounded-full p-2">2</div>
              <div>
                <h3 className="font-medium">Use websocket connections</h3>
                <p className="text-sm text-muted-foreground">Connect via websockets for real-time data instead of polling REST endpoints</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-b pb-4">
              <div className="bg-primary/10 text-primary rounded-full p-2">3</div>
              <div>
                <h3 className="font-medium">Implement exponential backoff</h3>
                <p className="text-sm text-muted-foreground">Automatically reduce request frequency when approaching limits</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary rounded-full p-2">4</div>
              <div>
                <h3 className="font-medium">Set up rate monitoring</h3>
                <p className="text-sm text-muted-foreground">Track API usage and get alerted before hitting limits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiRateLimits;
