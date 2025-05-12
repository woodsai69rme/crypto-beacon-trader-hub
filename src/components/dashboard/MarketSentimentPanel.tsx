
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { ResponsiveLine } from '@nivo/line';

const MarketSentimentPanel: React.FC = () => {
  const [tab, setTab] = useState<'btc' | 'eth' | 'market'>('market');
  
  // Mock data for sentiment timeline
  const sentimentData = {
    market: [
      { x: '1', y: 65 },
      { x: '2', y: 70 },
      { x: '3', y: 68 },
      { x: '4', y: 52 },
      { x: '5', y: 48 },
      { x: '6', y: 55 },
      { x: '7', y: 62 }
    ],
    btc: [
      { x: '1', y: 70 },
      { x: '2', y: 75 },
      { x: '3', y: 72 },
      { x: '4', y: 60 },
      { x: '5', y: 55 },
      { x: '6', y: 60 },
      { x: '7', y: 68 }
    ],
    eth: [
      { x: '1', y: 60 },
      { x: '2', y: 65 },
      { x: '3', y: 65 },
      { x: '4', y: 45 },
      { x: '5', y: 40 },
      { x: '6', y: 50 },
      { x: '7', y: 58 }
    ]
  };
  
  // Current sentiment values
  const sentimentScores = {
    market: 62,
    btc: 68,
    eth: 58
  };
  
  // Determine sentiment level
  const getSentimentLevel = (score: number) => {
    if (score >= 70) return { text: 'Very Bullish', color: 'text-green-500' };
    if (score >= 60) return { text: 'Bullish', color: 'text-green-500' };
    if (score >= 45) return { text: 'Neutral', color: 'text-blue-500' };
    if (score >= 35) return { text: 'Bearish', color: 'text-red-500' };
    return { text: 'Very Bearish', color: 'text-red-500' };
  };
  
  const currentSentiment = getSentimentLevel(sentimentScores[tab]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as 'btc' | 'eth' | 'market')}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="market">Overall</TabsTrigger>
            <TabsTrigger value="btc">Bitcoin</TabsTrigger>
            <TabsTrigger value="eth">Ethereum</TabsTrigger>
          </TabsList>
          
          <TabsContent value={tab} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{sentimentScores[tab]}</div>
                <div className={`text-sm ${currentSentiment.color}`}>
                  {currentSentiment.text}
                </div>
              </div>
              <div className={`p-3 rounded-full ${currentSentiment.color === 'text-green-500' ? 'bg-green-500/10' : currentSentiment.color === 'text-red-500' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                {currentSentiment.color === 'text-green-500' ? 
                  <TrendingUp className={`h-6 w-6 ${currentSentiment.color}`} /> : 
                  <TrendingDown className={`h-6 w-6 ${currentSentiment.color}`} />}
              </div>
            </div>
            
            <div className="h-[120px]">
              <ResponsiveLine
                data={[
                  {
                    id: 'sentiment',
                    data: sentimentData[tab],
                  },
                ]}
                margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 100,
                }}
                curve="monotoneX"
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickRotation: 0,
                  tickValues: 5,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickRotation: 0,
                  tickValues: 5,
                }}
                pointSize={4}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={[0, 25, 50, 75, 100]}
                colors={[currentSentiment.color === 'text-green-500' ? '#10b981' : currentSentiment.color === 'text-red-500' ? '#ef4444' : '#3b82f6']}
                lineWidth={3}
                enableArea={true}
                areaOpacity={0.1}
                useMesh={true}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 9,
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: '#e2e8f0',
                      strokeWidth: 1,
                      strokeDasharray: '4 4'
                    }
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 border rounded-md">
                <div className="text-xs text-muted-foreground">Reddit</div>
                <div className="font-medium">{tab === 'market' ? 58 : tab === 'btc' ? 64 : 55}</div>
              </div>
              <div className="text-center p-2 border rounded-md">
                <div className="text-xs text-muted-foreground">Twitter</div>
                <div className="font-medium">{tab === 'market' ? 66 : tab === 'btc' ? 72 : 61}</div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center pt-1">
              Last updated: {new Date().toLocaleString()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketSentimentPanel;
