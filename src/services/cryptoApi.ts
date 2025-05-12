
import axios from 'axios';
import { CoinOption } from '@/types/trading';

/**
 * Fetch cryptocurrency options for dropdowns
 * @returns List of available cryptocurrencies
 */
export const fetchCoinOptions = async (): Promise<CoinOption[]> => {
  try {
    // In a real implementation, this would be an API call
    // For this demo, we'll return some hardcoded options
    return [
      { 
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 61245.32,
        priceChange: 1245.32,
        changePercent: 2.3,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        value: 'bitcoin',
        label: 'Bitcoin (BTC)'
      },
      { 
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3010.45,
        priceChange: -45.67,
        changePercent: -1.5,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        value: 'ethereum',
        label: 'Ethereum (ETH)'
      },
      { 
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        price: 142.87,
        priceChange: 7.35,
        changePercent: 5.4,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        value: 'solana',
        label: 'Solana (SOL)'
      },
      { 
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        price: 0.57,
        priceChange: 0.03,
        changePercent: 5.8,
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        value: 'ripple',
        label: 'XRP (XRP)'
      },
      { 
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        price: 0.45,
        priceChange: 0.02,
        changePercent: 4.6,
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        value: 'cardano',
        label: 'Cardano (ADA)'
      },
      { 
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        price: 0.08,
        priceChange: 0.003,
        changePercent: 3.5,
        image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        value: 'dogecoin',
        label: 'Dogecoin (DOGE)'
      },
    ];
  } catch (error) {
    console.error('Error fetching coin options:', error);
    return [];
  }
};

/**
 * Fetch cryptocurrency market data
 * @returns Price and market data for cryptocurrencies
 */
export const fetchCoinMarketData = async (coinId: string): Promise<any> => {
  try {
    // Mock implementation
    return {
      id: coinId,
      symbol: getCoinSymbol(coinId),
      name: getCoinName(coinId),
      market_data: {
        current_price: {
          usd: getCoinPrice(coinId),
        },
        price_change_24h: getCoinPriceChange(coinId),
        price_change_percentage_24h: getCoinPercentChange(coinId),
        market_cap: {
          usd: getCoinMarketCap(coinId),
        },
        total_volume: {
          usd: getCoinVolume(coinId),
        },
        high_24h: {
          usd: getCoinPrice(coinId) * 1.05,
        },
        low_24h: {
          usd: getCoinPrice(coinId) * 0.95,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching coin market data:', error);
    return null;
  }
};

// Helper functions to get coin data
function getCoinSymbol(coinId: string): string {
  const map: Record<string, string> = {
    'bitcoin': 'btc',
    'ethereum': 'eth',
    'solana': 'sol',
    'ripple': 'xrp',
    'cardano': 'ada',
    'dogecoin': 'doge'
  };
  return map[coinId] || coinId.substring(0, 3);
}

function getCoinName(coinId: string): string {
  const map: Record<string, string> = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'solana': 'Solana',
    'ripple': 'XRP',
    'cardano': 'Cardano',
    'dogecoin': 'Dogecoin'
  };
  return map[coinId] || coinId.charAt(0).toUpperCase() + coinId.slice(1);
}

function getCoinPrice(coinId: string): number {
  const map: Record<string, number> = {
    'bitcoin': 61245.32,
    'ethereum': 3010.45,
    'solana': 142.87,
    'ripple': 0.57,
    'cardano': 0.45,
    'dogecoin': 0.08
  };
  return map[coinId] || 100;
}

function getCoinPriceChange(coinId: string): number {
  const map: Record<string, number> = {
    'bitcoin': 1245.32,
    'ethereum': -45.67,
    'solana': 7.35,
    'ripple': 0.03,
    'cardano': 0.02,
    'dogecoin': 0.003
  };
  return map[coinId] || 0;
}

function getCoinPercentChange(coinId: string): number {
  const map: Record<string, number> = {
    'bitcoin': 2.3,
    'ethereum': -1.5,
    'solana': 5.4,
    'ripple': 5.8,
    'cardano': 4.6,
    'dogecoin': 3.5
  };
  return map[coinId] || 0;
}

function getCoinMarketCap(coinId: string): number {
  const map: Record<string, number> = {
    'bitcoin': 1180000000000,
    'ethereum': 360000000000,
    'solana': 64000000000,
    'ripple': 32000000000,
    'cardano': 15000000000,
    'dogecoin': 10000000000
  };
  return map[coinId] || 1000000000;
}

function getCoinVolume(coinId: string): number {
  const map: Record<string, number> = {
    'bitcoin': 28000000000,
    'ethereum': 15000000000,
    'solana': 2500000000,
    'ripple': 1800000000,
    'cardano': 500000000,
    'dogecoin': 800000000
  };
  return map[coinId] || 100000000;
}
