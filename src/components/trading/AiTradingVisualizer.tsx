
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "@/components/ui/use-toast";

interface AiTradingVisualizerProps {
  botId: string;
  tradingPair: string;
  timeframe: string;
  isRunning: boolean;
}

// Helper function to generate realistic looking trading data
const generateTradingData = (days: number) => {
  const data = [];
  let price = 30000 + Math.random() * 5000;
  
  for (let i = 0; i < days; i++) {
    // Add some realism to price movements
    const change = Math.random() * 1000 - 500;
    price = Math.max(price + change, 25000);
    
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toLocaleDateString(),
      price,
      sma: Math.floor(price * 0.98), // Simple Moving Average
      signal: null,
    });
  }
  
  // Add some buy/sell signals
  const signalIndices = [
    Math.floor(days * 0.2),
    Math.floor(days * 0.5),
    Math.floor(days * 0.8),
  ];
  
  signalIndices.forEach(index => {
    if (index < data.length) {
      data[index].signal = Math.random() > 0.5 ? 'buy' : 'sell';
    }
  });
  
  return data;
};

const AiTradingVisualizer: React.FC<AiTradingVisualizerProps> = ({
  botId,
  tradingPair,
  timeframe,
  isRunning
}) => {
  const [data, setData] = useState<any[]>([]);
  const [signals, setSignals] = useState<{index: number, type: string}[]>([]);
  
  useEffect(() => {
    // Generate initial data for the chart
    setData(generateTradingData(30));
  }, [botId, tradingPair, timeframe]);
  
  useEffect(() => {
    if (!isRunning || !botId) return;
    
    // Simulate real-time updates and signals when bot is running
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastEntry = {...newData[newData.length - 1]};
        
        // Update the last price with some randomness
        const change = Math.random() * 200 - 100;
        lastEntry.price += change;
        lastEntry.sma = Math.floor(lastEntry.price * 0.98);
        
        // Occasionally generate a trading signal
        if (Math.random() > 0.8) {
          const signalType = Math.random() > 0.5 ? 'buy' : 'sell';
          lastEntry.signal = signalType;
          
          // Add to signals list
          setSignals(prevSignals => [
            ...prevSignals, 
            { index: newData.length - 1, type: signalType }
          ]);
          
          toast({
            title: `${signalType.toUpperCase()} Signal Generated`,
            description: `${tradingPair} at $${Math.floor(lastEntry.price)}`
          });
        } else {
          lastEntry.signal = null;
        }
        
        newData[newData.length - 1] = lastEntry;
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isRunning, botId, tradingPair]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium mb-4">
          {tradingPair} ({timeframe}) Trading Chart with AI Signals
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}}
                tickFormatter={(value) => {
                  // Only show some dates to avoid overcrowding
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                domain={['dataMin - 1000', 'dataMax + 1000']}
                tick={{fontSize: 12}} 
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#6b7280" 
                strokeWidth={1.5} 
                strokeDasharray="5 5" 
                dot={false}
              />
              
              {/* Add buy signals */}
              {data.map((entry, index) => {
                if (entry.signal === 'buy') {
                  return (
                    <ReferenceLine 
                      key={`buy-${index}`}
                      x={entry.date} 
                      stroke="green" 
                      strokeDasharray="3 3"
                      label={{ value: 'BUY', position: 'insideTopLeft', fill: 'green' }}
                    />
                  );
                }
                return null;
              })}
              
              {/* Add sell signals */}
              {data.map((entry, index) => {
                if (entry.signal === 'sell') {
                  return (
                    <ReferenceLine 
                      key={`sell-${index}`}
                      x={entry.date} 
                      stroke="red" 
                      strokeDasharray="3 3"
                      label={{ value: 'SELL', position: 'insideBottomLeft', fill: 'red' }}
                    />
                  );
                }
                return null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex mt-2 justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
            <span>Price</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
            <span>SMA</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Buy Signal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Sell Signal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingVisualizer;
