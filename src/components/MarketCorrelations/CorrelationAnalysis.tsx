import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCoinMarketData } from '@/services/cryptoApi';
import { CoinOption, CryptoData } from '@/types/trading';

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
  initialCoinId?: string;
  timeframe?: string;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ initialCoinId = "bitcoin", timeframe = "7d" }) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoinId);
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      loadCorrelationData(selectedCoinId);
    }
  }, [selectedCoinId, timeframe]);

  const loadCoins = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCoinMarketData();
      setCoins(data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price || 0,
        priceChange: coin.priceChange || 0,
        image: coin.image,
        marketCap: coin.marketCap,
        volume: coin.volume,
        value: coin.id,
        label: `${coin.name} (${coin.symbol})`
      })));
    } catch (error) {
      console.error("Failed to load coins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCorrelationData = async (coinId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCoinMarketData();
      const selectedCoin = data.find(coin => coin.id === coinId);

      if (!selectedCoin) {
        console.error("Selected coin not found");
        return;
      }

      const formatCoinData = (coins: CoinOption[]): CryptoData[] => {
        return coins.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.price,
          priceChange: coin.priceChange || 0, // Add priceChange with fallback
          image: coin.image,
          marketCap: coin.marketCap,
          volume: coin.volume,
          changePercent: coin.changePercent
        }));
      };
      
      const formattedData = formatCoinData(coins);

      const labels = formattedData.map(coin => coin.name);
      const prices = formattedData.map(coin => coin.price);

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Price Correlation',
            data: prices,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      };

      setCorrelationData(chartData);
    } catch (error) {
      console.error("Failed to load correlation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price Correlation Chart',
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Correlations</CardTitle>
        <CardDescription>Analyze price correlations between cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
            <SelectTrigger className="w-[180px]">
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

          {isLoading ? (
            <div>Loading...</div>
          ) : correlationData ? (
            <Line options={options} data={correlationData} />
          ) : (
            <div>No data available.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
