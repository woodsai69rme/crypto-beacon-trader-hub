
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, Heatmap, Tooltip } from "recharts";
import { RefreshCw, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for correlation heatmap
const correlationData = [
  { name: "BTC", BTC: 1.0, ETH: 0.82, SOL: 0.68, ADA: 0.57, XRP: 0.49, DOT: 0.71, LINK: 0.65, AVAX: 0.72, MATIC: 0.69 },
  { name: "ETH", BTC: 0.82, ETH: 1.0, SOL: 0.75, ADA: 0.62, XRP: 0.51, DOT: 0.68, LINK: 0.79, AVAX: 0.77, MATIC: 0.85 },
  { name: "SOL", BTC: 0.68, ETH: 0.75, SOL: 1.0, ADA: 0.58, XRP: 0.47, DOT: 0.63, LINK: 0.67, AVAX: 0.82, MATIC: 0.76 },
  { name: "ADA", BTC: 0.57, ETH: 0.62, SOL: 0.58, ADA: 1.0, XRP: 0.65, DOT: 0.71, LINK: 0.59, AVAX: 0.63, MATIC: 0.61 },
  { name: "XRP", BTC: 0.49, ETH: 0.51, SOL: 0.47, ADA: 0.65, XRP: 1.0, DOT: 0.53, LINK: 0.48, AVAX: 0.51, MATIC: 0.49 },
  { name: "DOT", BTC: 0.71, ETH: 0.68, SOL: 0.63, ADA: 0.71, XRP: 0.53, DOT: 1.0, LINK: 0.66, AVAX: 0.69, MATIC: 0.62 },
  { name: "LINK", BTC: 0.65, ETH: 0.79, SOL: 0.67, ADA: 0.59, XRP: 0.48, DOT: 0.66, LINK: 1.0, AVAX: 0.71, MATIC: 0.83 },
  { name: "AVAX", BTC: 0.72, ETH: 0.77, SOL: 0.82, ADA: 0.63, XRP: 0.51, DOT: 0.69, LINK: 0.71, AVAX: 1.0, MATIC: 0.75 },
  { name: "MATIC", BTC: 0.69, ETH: 0.85, SOL: 0.76, ADA: 0.61, XRP: 0.49, DOT: 0.62, LINK: 0.83, AVAX: 0.75, MATIC: 1.0 }
];

// Time period options for correlation calculation
const timePeriods = [
  { value: "1W", label: "1 Week" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" }
];

type CorrelationStrength = "strong-positive" | "moderate-positive" | "weak-positive" | "neutral" | "weak-negative" | "moderate-negative" | "strong-negative";

const getCorrelationColor = (value: number): string => {
  if (value >= 0.8) return "rgba(34, 197, 94, 0.9)"; // Strong positive
  if (value >= 0.6) return "rgba(34, 197, 94, 0.7)"; // Moderate positive
  if (value >= 0.4) return "rgba(34, 197, 94, 0.5)"; // Weak positive
  if (value >= -0.4) return "rgba(148, 163, 184, 0.3)"; // Neutral
  if (value >= -0.6) return "rgba(239, 68, 68, 0.5)"; // Weak negative
  if (value >= -0.8) return "rgba(239, 68, 68, 0.7)"; // Moderate negative
  return "rgba(239, 68, 68, 0.9)"; // Strong negative
};

const getCorrelationDescription = (value: number): { strength: CorrelationStrength; description: string } => {
  if (value >= 0.8) return { strength: "strong-positive", description: "Strong positive correlation" };
  if (value >= 0.6) return { strength: "moderate-positive", description: "Moderate positive correlation" };
  if (value >= 0.4) return { strength: "weak-positive", description: "Weak positive correlation" };
  if (value >= -0.4) return { strength: "neutral", description: "No significant correlation" };
  if (value >= -0.6) return { strength: "weak-negative", description: "Weak negative correlation" };
  if (value >= -0.8) return { strength: "moderate-negative", description: "Moderate negative correlation" };
  return { strength: "strong-negative", description: "Strong negative correlation" };
};

const MarketCorrelations = () => {
  const [timePeriod, setTimePeriod] = useState("1M");
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Correlation data refreshed",
        description: `Updated for ${timePeriod} time period`,
      });
    }, 1500);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const assetName = data.name;
      const correlatedAsset = Object.keys(data).find(key => 
        key !== "name" && key === payload[0].name);
      
      if (correlatedAsset) {
        const correlationValue = data[correlatedAsset];
        const { description } = getCorrelationDescription(correlationValue);
        
        return (
          <div className="bg-background border p-2 rounded-md shadow-md text-sm">
            <p className="font-medium">{assetName} → {correlatedAsset}</p>
            <p>Correlation: {correlationValue.toFixed(2)}</p>
            <p>{description}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">Asset Correlations</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map(period => (
                  <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
        <CardDescription>
          Price correlation between major cryptocurrencies
        </CardDescription>
        {showHelp && (
          <div className="mt-2 p-2 bg-secondary/20 rounded text-xs">
            <p className="font-medium">Understanding Correlation:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1">
              <li>1.0: Perfect positive correlation - assets move exactly together</li>
              <li>0.0: No correlation - assets move independently</li>
              <li>-1.0: Perfect negative correlation - assets move exactly opposite</li>
              <li>Higher correlation means less diversification benefit</li>
            </ul>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Heatmap
              data={correlationData}
              nameKey="name"
              dataKey={(entry, index) => entry.name}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Tooltip content={<CustomTooltip />} />
            </Heatmap>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2 items-center text-xs">
            <span>Strong Negative</span>
            <div className="flex h-2">
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(239, 68, 68, 0.9)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(239, 68, 68, 0.7)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(239, 68, 68, 0.5)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(148, 163, 184, 0.3)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(34, 197, 94, 0.5)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(34, 197, 94, 0.7)" }}></div>
              <div style={{ width: 15, height: 8, backgroundColor: "rgba(34, 197, 94, 0.9)" }}></div>
            </div>
            <span>Strong Positive</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Based on historical price data</span>
        <span>Time period: {timePeriods.find(p => p.value === timePeriod)?.label}</span>
      </CardFooter>
    </Card>
  );
};

export default MarketCorrelations;
