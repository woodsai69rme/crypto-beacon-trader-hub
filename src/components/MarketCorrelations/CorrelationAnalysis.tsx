
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCoinMarketData } from '@/services/cryptoApi';
import { CoinOption, CryptoData } from '@/types/trading';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CorrelationAnalysisProps {
  baseCoinId: string;
  compareCoinIds: string[];
  timeframe: number; // days
}

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ 
  baseCoinId,
  compareCoinIds,
  timeframe
}) => {
  const [correlationData, setCorrelationData] = useState<{
    baseCoin: { dates: string[], prices: number[] },
    comparedCoins: Record<string, { dates: string[], prices: number[], correlation: number }>
  }>({
    baseCoin: { dates: [], prices: [] },
    comparedCoins: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch base coin data
        const baseCoinData = await fetchCoinMarketData(baseCoinId, timeframe);
        
        // Convert timestamps to readable dates
        const baseDates = baseCoinData.timestamps.map(ts => 
          new Date(ts).toLocaleDateString()
        );
        
        // Initialize result object
        const result = {
          baseCoin: {
            dates: baseDates,
            prices: baseCoinData.prices
          },
          comparedCoins: {} as Record<string, { dates: string[], prices: number[], correlation: number }>
        };
        
        // Fetch data for all comparison coins
        await Promise.all(compareCoinIds.map(async (coinId) => {
          const coinData = await fetchCoinMarketData(coinId, timeframe);
          
          // Convert timestamps to dates
          const dates = coinData.timestamps.map(ts => 
            new Date(ts).toLocaleDateString()
          );
          
          // Calculate correlation coefficient with base coin
          const correlation = calculateCorrelation(
            baseCoinData.prices,
            coinData.prices
          );
          
          result.comparedCoins[coinId] = {
            dates,
            prices: coinData.prices,
            correlation
          };
        }));
        
        setCorrelationData(result);
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError('Failed to fetch correlation data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (baseCoinId && compareCoinIds.length > 0) {
      fetchData();
    }
  }, [baseCoinId, compareCoinIds, timeframe]);
  
  // Function to calculate Pearson correlation coefficient
  const calculateCorrelation = (array1: number[], array2: number[]): number => {
    // Use the shorter array length to avoid index errors
    const length = Math.min(array1.length, array2.length);
    
    if (length < 2) return 0;
    
    // Calculate means
    let sum1 = 0, sum2 = 0;
    
    for (let i = 0; i < length; i++) {
      sum1 += array1[i];
      sum2 += array2[i];
    }
    
    const mean1 = sum1 / length;
    const mean2 = sum2 / length;
    
    // Calculate correlation
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;
    
    for (let i = 0; i < length; i++) {
      const diff1 = array1[i] - mean1;
      const diff2 = array2[i] - mean2;
      
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }
    
    if (denominator1 === 0 || denominator2 === 0) return 0;
    
    return numerator / Math.sqrt(denominator1 * denominator2);
  };
  
  // Prepare chart data
  const chartData = {
    labels: correlationData.baseCoin.dates,
    datasets: [
      {
        label: `${baseCoinId.toUpperCase()}`,
        data: correlationData.baseCoin.prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      ...Object.entries(correlationData.comparedCoins).map(([coinId, data], index) => ({
        label: `${coinId.toUpperCase()} (r=${data.correlation.toFixed(2)})`,
        data: data.prices,
        borderColor: `rgb(${255 - (index * 30)}, ${100 + (index * 30)}, ${150})`,
        backgroundColor: `rgba(${255 - (index * 30)}, ${100 + (index * 30)}, ${150}, 0.2)`,
        tension: 0.1
      }))
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Price Correlation with ${baseCoinId.toUpperCase()}`
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: $${context.parsed.y.toFixed(2)}`;
            }
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    }
  };
  
  if (loading) {
    return <div>Loading correlation data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <div className="correlation-analysis">
      <h3 className="text-lg font-medium mb-4">Price Correlation Analysis</h3>
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(correlationData.comparedCoins).map(([coinId, data]) => (
          <div key={coinId} className="border rounded p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{coinId.toUpperCase()}</h4>
              <div 
                className={`font-bold ${
                  data.correlation > 0.7 ? 'text-green-600' : 
                  data.correlation < -0.7 ? 'text-red-600' : 
                  data.correlation > 0.3 ? 'text-green-400' : 
                  data.correlation < -0.3 ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                r = {data.correlation.toFixed(2)}
              </div>
            </div>
            <p className="text-sm mt-2">
              {data.correlation > 0.7 ? 'Strong positive correlation' : 
               data.correlation < -0.7 ? 'Strong negative correlation' : 
               data.correlation > 0.3 ? 'Moderate positive correlation' : 
               data.correlation < -0.3 ? 'Moderate negative correlation' : 
               'Weak or no correlation'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorrelationAnalysis;
