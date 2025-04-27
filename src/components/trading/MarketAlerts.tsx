
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const MarketAlerts: React.FC = () => {
  // List of sample alerts to display
  const alerts = [
    {
      id: "alert-1",
      title: "BTC Price Alert",
      message: "Bitcoin broke above $65,000",
      timestamp: "10 min ago",
      priority: "high"
    },
    {
      id: "alert-2",
      title: "Market Volatility",
      message: "Increased volatility detected across major assets",
      timestamp: "25 min ago",
      priority: "medium"
    },
    {
      id: "alert-3",
      title: "ETH Volume Spike",
      message: "Ethereum trading volume up 35% in the last hour",
      timestamp: "48 min ago",
      priority: "medium"
    },
    {
      id: "alert-4",
      title: "New Portfolio High",
      message: "Your portfolio value reached a new all-time high",
      timestamp: "1 hour ago",
      priority: "low"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Market Alerts
          </CardTitle>
          <Badge variant="outline">{alerts.length} alerts</Badge>
        </div>
        <CardDescription>Recent market events and notifications</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-md border flex items-start ${
                alert.priority === "high"
                  ? "bg-red-500/10 border-red-500/30"
                  : alert.priority === "medium"
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-muted/40"
              }`}
            >
              <div>
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {alert.message}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {alert.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketAlerts;
