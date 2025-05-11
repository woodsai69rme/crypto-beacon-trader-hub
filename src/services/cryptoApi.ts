
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
      symbol: coinId === 'bitcoin' ? 'btc' : coinId === 'ethereum' ? 'eth' : 'sol',
      name: coinId === 'bitcoin' ? 'Bitcoin' : coinId === 'ethereum' ? 'Ethereum' : 'Solana',
      market_data: {
        current_price: {
          usd: coinId === 'bitcoin' ? 61245.32 : coinId === 'ethereum' ? 3010.45 : 142.87,
        },
        price_change_24h: coinId === 'bitcoin' ? 1245.32 : coinId === 'ethereum' ? -45.67 : 7.35,
        price_change_percentage_24h: coinId === 'bitcoin' ? 2.3 : coinId === 'ethereum' ? -1.5 : 5.4,
        market_cap: {
          usd: coinId === 'bitcoin' ? 1180000000000 : coinId === 'ethereum' ? 360000000000 : 64000000000,
        },
        total_volume: {
          usd: coinId === 'bitcoin' ? 28000000000 : coinId === 'ethereum' ? 15000000000 : 2500000000,
        },
        high_24h: {
          usd: coinId === 'bitcoin' ? 62500 : coinId === 'ethereum' ? 3100 : 148,
        },
        low_24h: {
          usd: coinId === 'bitcoin' ? 60000 : coinId === 'ethereum' ? 2950 : 138,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching coin market data:', error);
    return null;
  }
};
