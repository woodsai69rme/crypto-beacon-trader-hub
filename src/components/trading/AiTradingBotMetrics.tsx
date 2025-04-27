
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AiTradingBotMetricsProps {
  botId: string;
  isRunning: boolean;
}

const AiTradingBotMetrics = ({ botId, isRunning }: AiTradingBotMetricsProps) => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 15,
    memoryUsage: 23,
    apiCalls: 45,
    confidence: 72,
    accuracy: 68,
    latency: 240, // ms
    predictionsPerSecond: 4.2,
    analysisComplexity: 67,
    tradingPerformance: [
      { day: 'Mon', return: 1.2 },
      { day: 'Tue', return: -0.8 },
      { day: 'Wed', return: 2.1 },
      { day: 'Thu', return: 0.4 },
      { day: 'Fri', return: -0.5 },
      { day: 'Sat', return: 1.3 },
      { day: 'Sun', return: 0.7 },
    ],
    predictionAccuracy: [
      { category: 'Price', correct: 67, incorrect: 33 },
      { category: 'Trend', correct: 72, incorrect: 28 },
      { category: 'Volume', correct: 58, incorrect: 42 },
      { category: 'Pattern', correct: 76, incorrect: 24 },
    ]
  });
  
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(100, prev.cpuUsage + (Math.random() * 6) - 3),
        memoryUsage: Math.min(100, prev.memoryUsage + (Math.random() * 4) - 2),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 3),
        confidence: Math.min(100, Math.max(0, prev.confidence + (Math.random() * 8) - 4)),
        latency: Math.max(100, prev.latency + (Math.random() * 40) - 20),
        predictionsPerSecond: Math.max(0.5, prev.predictionsPerSecond + (Math.random() * 0.4) - 0.2),
        analysisComplexity: Math.min(100, Math.max(10, prev.analysisComplexity + (Math.random() * 10) - 5)),
        tradingPerformance: prev.tradingPerformance.map(day => ({
          ...day,
          return: day.return + (Math.random() * 0.4) - 0.2
        })),
        predictionAccuracy: prev.predictionAccuracy.map(category => {
          const shift = Math.floor(Math.random() * 4) - 2;
          return {
            ...category,
            correct: Math.min(100, Math.max(0, category.correct + shift)),
            incorrect: Math.min(100, Math.max(0, category.incorrect - shift)),
          };
        })
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resource Usage */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-4">Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>CPU Usage</span>
                  <span>{Math.round(metrics.cpuUsage)}%</span>
                </div>
                <Progress value={metrics.cpuUsage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Memory Usage</span>
                  <span>{Math.round(metrics.memoryUsage)}%</span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>API Calls</span>
                  <span>{metrics.apiCalls} calls</span>
                </div>
                <Progress value={(metrics.apiCalls / 100) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Performance */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-4">AI Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(metrics.confidence)}%</span>
                </div>
                <Progress value={metrics.confidence} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Latency</span>
                  <span>{Math.round(metrics.latency)} ms</span>
                </div>
                <Progress value={(metrics.latency / 500) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Analysis Complexity</span>
                  <span>{Math.round(metrics.analysisComplexity)}%</span>
                </div>
                <Progress value={metrics.analysisComplexity} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Trading Performance Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-4">Trading Performance</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.tradingPerformance}>
                <defs>
                  <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3F83F8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3F83F8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                  domain={[-3, 3]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Return']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="return" 
                  stroke="#3F83F8" 
                  fillOpacity={1} 
                  fill="url(#colorReturn)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Prediction Accuracy */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-4">Prediction Accuracy</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={metrics.predictionAccuracy} 
                margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
                stackOffset="expand"
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                  unit="%"
                />
                <YAxis 
                  type="category"
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                />
                <Bar dataKey="correct" stackId="a" fill="#10B981" />
                <Bar dataKey="incorrect" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-[#EF4444]"></div>
              <span>Incorrect</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBotMetrics;
