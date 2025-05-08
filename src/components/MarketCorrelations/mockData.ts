
import { CryptoData } from '@/types/trading';

export const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 61245.32,
    priceChange: 1245.32,
    changePercent: 2.3,
    priceChangePercentage: 2.3,
    marketCap: 1180000000000,
    volume: 28000000000,
    circulatingSupply: 19250000,
    rank: 1
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    priceChangePercentage: 2.15,
    marketCap: 373952067386,
    volume: 21891456789,
    circulatingSupply: 120450000,
    rank: 2
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    price: 543.12,
    priceChange: -15.23,
    changePercent: -2.8,
    priceChangePercentage: -2.8,
    marketCap: 85123456789,
    volume: 7823456789,
    circulatingSupply: 156785000,
    rank: 3
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    price: 152.37,
    priceChange: 5.23,
    changePercent: 3.55,
    priceChangePercentage: 3.55,
    marketCap: 67891234567,
    volume: 3578912345,
    circulatingSupply: 445678900,
    rank: 4
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    price: 0.45,
    priceChange: -0.01,
    changePercent: -2.17,
    priceChangePercentage: -2.17,
    marketCap: 15893456789,
    volume: 467891234,
    circulatingSupply: 35312456700,
    rank: 8
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    price: 0.138,
    priceChange: -0.004,
    changePercent: -2.1,
    priceChangePercentage: -2.1,
    marketCap: 18000000000,
    volume: 1900000000,
    circulatingSupply: 130456789000,
    rank: 9
  }
];
