
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoaderCircle } from 'lucide-react';

// This function should be created in the API service
const fetchCoinChartData = async (coinId: string, days: number = 7) => {
  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate dummy data for now
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString(),
      price: 20000 + Math.random() * 10000
    });
  }
  
  return data;
};

interface CryptoChartProps {
  coinId: string;
  days?: number;
  height?: number | string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ 
  coinId, 
  days = 7,
  height = 300 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCoinChartData(coinId, days);
        setChartData(data);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [coinId, days]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center" style={{ height }}>
            <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
