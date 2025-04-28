import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  timestamp: string;
  buyProbability: number;
  sellProbability: number;
  holdProbability: number;
  expectedValue: number;
  riskRewardRatio: number;
  confidenceScore: number;
  signals: {
    indicator: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
    strength: number;
    timeframe: string;
  }[];
  shortTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  mediumTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
  longTerm: {
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    targetPrice?: number;
  };
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({
  symbol,
  timeframe,
  timestamp,
  buyProbability,
  sellProbability,
  holdProbability,
  expectedValue,
  riskRewardRatio,
  confidenceScore,
  signals,
  shortTerm,
  mediumTerm,
  longTerm,
}) => {
  const data = [
    { name: 'Buy', value: buyProbability, type: 'buy' },
    { name: 'Sell', value: sellProbability, type: 'sell' },
    { name: 'Hold', value: holdProbability, type: 'hold' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantitative Analysis</CardTitle>
        <CardDescription>
          Probability analysis for {symbol} on {timeframe} timeframe
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium">Probabilities</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value, name, props) => [`${value}%`, 'Probability']} />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium">Expected Value</h4>
          <p className="text-sm">
            {expectedValue > 0 ? 'Positive' : 'Negative'} Expected Value: {expectedValue.toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium">Risk/Reward Ratio</h4>
          <p className="text-sm">
            {riskRewardRatio.toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium">Confidence Score</h4>
          <p className="text-sm">
            {confidenceScore.toFixed(2)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Signals</h4>
          <ul className="list-disc pl-5">
            {signals.map((signal, index) => (
              <li key={index} className="text-sm">
                {signal.indicator}: {signal.signal} ({signal.strength})
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
