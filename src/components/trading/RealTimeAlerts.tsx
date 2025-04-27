
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CoinOption } from "@/types/trading";
import { fetchTopCoins } from "@/services/cryptoApi";
import { toast } from "@/components/ui/use-toast";

interface RealTimeAlertsProps {
  availableCoins?: CoinOption[];
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ availableCoins = [] }) => {
  const [selectedCoin, setSelectedCoin] = useState<string | undefined>(undefined);
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [priceTarget, setPriceTarget] = useState<string>("");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [coins, setCoins] = useState<CoinOption[]>(availableCoins);
  const [isLoading, setIsLoading] = useState(availableCoins.length === 0);

  useEffect(() => {
    if (availableCoins.length === 0) {
      fetchTopCoins(20)
        .then(coinsData => {
          setCoins(coinsData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to load coins:", error);
          setIsLoading(false);
        });
    } else {
      setCoins(availableCoins);
    }
  }, [availableCoins]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCoin || !priceTarget) {
      toast({
        title: "Missing information",
        description: "Please select a coin and enter a price target.",
        variant: "destructive"
      });
      return;
    }

    const newAlert = {
      coin: selectedCoin,
      condition: alertCondition,
      price: priceTarget,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAlerts([...alerts, newAlert]);
    setSelectedCoin(undefined);
    setPriceTarget("");
    
    toast({
      title: "Alert set",
      description: `You'll be notified when ${coins.find(c => c.id === selectedCoin)?.symbol} reaches the target price.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Price Alerts</CardTitle>
        <CardDescription>Get notified when your favorite coins reach your target prices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">No active alerts set.</p>
          ) : (
            <ul>
              {alerts.map((alert, index) => (
                <li key={index} className="mb-2">
                  Alert: {coins.find(c => c.id === alert.coin)?.symbol || alert.coin} will trigger when price is {alert.condition} ${alert.price}
                  <span className="text-xs text-muted-foreground ml-2">({alert.timestamp})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Asset</Label>
              {isLoading ? (
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
              ) : (
                <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a coin" />
                  </SelectTrigger>
                  <SelectContent>
                    {coins.map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label>Condition</Label>
              <Select value={alertCondition} onValueChange={(value: "above" | "below") => setAlertCondition(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price Target</Label>
              <Input
                type="number"
                value={priceTarget}
                onChange={(e) => setPriceTarget(e.target.value)}
                placeholder="Enter target price"
              />
            </div>

            <Button onClick={handleSubmit}>Set Alert</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
