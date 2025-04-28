
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import FibonacciAnalysis from "./FibonacciAnalysis";
import HyblockLiquidityMap from "./HyblockLiquidityMap";
import TradingViewChart from "./TradingViewChart";
import QuantitativeAnalysis from "./QuantitativeAnalysis";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdvancedTradingProps {
  className?: string;
}

const AdvancedTrading: React.FC<AdvancedTradingProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Advanced Trading Tools</CardTitle>
        <CardDescription>
          Professional-grade analysis tools for advanced traders
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="fibonacci">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-4`}>
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
            <TabsTrigger value="hyblock">Hyblock</TabsTrigger>
            <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            <TabsTrigger value="quantitative">Probability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fibonacci">
            <FibonacciAnalysis />
          </TabsContent>
          
          <TabsContent value="hyblock">
            <HyblockLiquidityMap />
          </TabsContent>
          
          <TabsContent value="tradingview">
            <TradingViewChart 
              symbol="BTCUSD" 
              interval="240" 
              theme={theme === "dark" ? "dark" : "light"}
              style="candles"
              studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies", "MASimple@tv-basicstudies"]}
              height={550}
            />
          </TabsContent>
          
          <TabsContent value="quantitative">
            <QuantitativeAnalysis />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedTrading;
