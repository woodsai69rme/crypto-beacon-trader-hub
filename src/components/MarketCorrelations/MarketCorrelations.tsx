
import React, { useState, useEffect } from "react";
import { generateMockCorrelations } from "./mockData";
import { CorrelationHeatmap } from "./CorrelationHeatmap";
import { fetchTopCoins } from "@/services/cryptoApi";
import { CoinOption, CryptoData } from "@/types/trading";

const convertToCryptoData = (coins: CoinOption[]): CryptoData[] => {
  return coins.map(coin => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    current_price: coin.price || 0,
    market_cap: coin.marketCap || 0,
    market_cap_rank: 0,
    price_change_24h: coin.priceChange,
    price_change_percentage_24h: coin.changePercent,
    image: coin.image,
    priceChange: coin.priceChange,
    changePercent: coin.changePercent,
    marketCap: coin.marketCap,
    volume: coin.volume
  }));
};

const MarketCorrelations = () => {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [correlations, setCorrelations] = useState<{[key: string]: {[key: string]: number}}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const topCoins = await fetchTopCoins(10);
        const cryptoData = convertToCryptoData(topCoins);
        setCoins(cryptoData);
        setCorrelations(generateMockCorrelations(cryptoData, timeRange));
      } catch (error) {
        console.error('Error fetching correlation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Market Correlations</h2>
      
      <div className="mb-4">
        <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">
          Time Range:
        </label>
        <select
          id="timeRange"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          disabled={isLoading}
        >
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="text-center">Loading correlations...</div>
      ) : (
        <CorrelationHeatmap coins={coins} correlations={correlations} />
      )}
    </div>
  );
};

export default MarketCorrelations;
