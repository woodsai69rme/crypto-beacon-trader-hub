
import { CryptoData } from '@/types/trading';

// Mock data for correlation matrix
export const mockCorrelationData = {
  coins: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 65423.45, priceChange: 1245.67, changePercent: 1.94, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3480.12, priceChange: -45.23, changePercent: -1.28, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 608.78, priceChange: 12.44, changePercent: 2.09, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 143.56, priceChange: 5.67, changePercent: 4.12, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.458, priceChange: 0.012, changePercent: 2.69, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.572, priceChange: -0.018, changePercent: -3.05, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 6.82, priceChange: 0.23, changePercent: 3.49, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.142, priceChange: 0.008, changePercent: 5.97, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' }
  ],
  correlationMatrix: [
    [1.00, 0.82, 0.76, 0.79, 0.68, 0.54, 0.72, 0.48],
    [0.82, 1.00, 0.65, 0.85, 0.62, 0.47, 0.69, 0.42],
    [0.76, 0.65, 1.00, 0.58, 0.71, 0.61, 0.55, 0.53],
    [0.79, 0.85, 0.58, 1.00, 0.59, 0.43, 0.78, 0.39],
    [0.68, 0.62, 0.71, 0.59, 1.00, 0.74, 0.63, 0.67],
    [0.54, 0.47, 0.61, 0.43, 0.74, 1.00, 0.49, 0.78],
    [0.72, 0.69, 0.55, 0.78, 0.63, 0.49, 1.00, 0.52],
    [0.48, 0.42, 0.53, 0.39, 0.67, 0.78, 0.52, 1.00]
  ]
};

// Mock historical price data for the past 30 days (one entry per day)
export const mockHistoricalPrices: Record<string, number[]> = {
  'bitcoin': [
    62500, 63100, 64200, 63800, 64500, 65300, 64800, 63900, 62700, 63400,
    64100, 65000, 65800, 65200, 64700, 63500, 64300, 64900, 65500, 66200,
    65700, 64500, 63800, 64200, 64800, 65300, 65900, 65400, 64800, 65423.45
  ],
  'ethereum': [
    3200, 3250, 3320, 3280, 3350, 3400, 3380, 3320, 3250, 3290,
    3340, 3380, 3420, 3390, 3360, 3300, 3340, 3370, 3410, 3450,
    3430, 3380, 3330, 3350, 3380, 3410, 3450, 3420, 3390, 3480.12
  ],
  'binancecoin': [
    580, 585, 590, 582, 592, 598, 594, 585, 575, 582,
    590, 598, 605, 600, 595, 585, 590, 596, 602, 610,
    606, 595, 586, 590, 596, 602, 608, 604, 600, 608.78
  ],
  'solana': [
    130, 133, 137, 135, 139, 142, 140, 136, 132, 135,
    138, 141, 144, 142, 139, 135, 138, 141, 144, 147,
    145, 140, 137, 139, 141, 144, 147, 145, 142, 143.56
  ],
  'cardano': [
    0.42, 0.425, 0.432, 0.428, 0.435, 0.442, 0.44, 0.432, 0.422, 0.428,
    0.435, 0.442, 0.45, 0.445, 0.44, 0.43, 0.436, 0.442, 0.448, 0.455,
    0.45, 0.44, 0.432, 0.436, 0.442, 0.448, 0.455, 0.45, 0.445, 0.458
  ],
  'ripple': [
    0.58, 0.585, 0.59, 0.582, 0.592, 0.598, 0.594, 0.585, 0.575, 0.582,
    0.59, 0.598, 0.605, 0.6, 0.595, 0.585, 0.59, 0.596, 0.602, 0.61,
    0.605, 0.595, 0.585, 0.588, 0.592, 0.596, 0.588, 0.58, 0.575, 0.572
  ],
  'polkadot': [
    6.2, 6.25, 6.32, 6.28, 6.35, 6.42, 6.4, 6.32, 6.22, 6.28,
    6.35, 6.42, 6.5, 6.45, 6.4, 6.3, 6.36, 6.42, 6.48, 6.55,
    6.5, 6.4, 6.32, 6.36, 6.42, 6.48, 6.55, 6.5, 6.45, 6.82
  ],
  'dogecoin': [
    0.13, 0.132, 0.135, 0.133, 0.136, 0.138, 0.137, 0.134, 0.131, 0.133,
    0.135, 0.138, 0.14, 0.139, 0.137, 0.134, 0.136, 0.138, 0.14, 0.142,
    0.141, 0.138, 0.135, 0.136, 0.138, 0.14, 0.142, 0.141, 0.139, 0.142
  ]
};
