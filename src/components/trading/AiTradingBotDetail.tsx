
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AiBotTradingProps } from '@/types/trading';
import { Badge } from '@/components/ui/badge';

// Sample data for the bot's performance chart
const generatePerformanceData = () => {
  const data = [];
  let value = 1000;
  
  for (let i = 0; i < 30; i++) {
    // Random daily change between -1.5% and +2%
    const dailyChange = Math.random() * 3.5 - 1.5;
    value = value * (1 + dailyChange / 100);
    
    data.push({
      day: i + 1,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
};

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({ botId, strategyId, strategyName }) => {
  const performanceData = generatePerformanceData();
  const initialValue = performanceData[0].value;
  const currentValue = performanceData[performanceData.length - 1].value;
  const percentChange = ((currentValue - initialValue) / initialValue) * 100;
  const isPositive = percentChange >= 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Current Value</div>
            <div className="text-xl font-bold">${currentValue.toFixed(2)}</div>
            <div className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{percentChange.toFixed(2)}% all time
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Strategy</div>
            <div className="text-lg font-medium">{strategyName}</div>
            <Badge variant="outline" className="mt-1">{strategyId}</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs text-muted-foreground">Last Signal</div>
            <div className="text-lg font-medium">BUY</div>
            <div className="text-xs">2 hours ago</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="day" />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card-bg, #222333)',
                borderColor: 'var(--border-color, #333344)',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`$${value}`, 'Value']}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#4ade80" : "#f87171"} 
              dot={false} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="font-medium">24 Trades</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="font-medium">78%</div>
          <div className="text-xs text-muted-foreground">Win Rate</div>
        </div>
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="font-medium">0.12 BTC</div>
          <div className="text-xs text-muted-foreground">Volume</div>
        </div>
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="font-medium">2.1</div>
          <div className="text-xs text-muted-foreground">Risk/Reward</div>
        </div>
      </div>
    </div>
  );
};

export default AiTradingBotDetail;
