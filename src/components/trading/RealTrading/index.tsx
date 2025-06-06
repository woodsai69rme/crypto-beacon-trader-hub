
import React, { useState } from 'react';
import { CoinOption } from '@/types/trading';
import RealTimePrices from './RealTimePrices';

const RealTimeTrading: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  
  const initialCoins: CoinOption[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 65000,
      priceChange: 1250,
      changePercent: 2.1,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)',
      image: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3200,
      priceChange: -45,
      changePercent: -1.4,
      value: 'ethereum',
      label: 'Ethereum (ETH)',
      image: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png'
    }
  ];

  const handleSelectCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
  };

  return (
    <div className="space-y-6">
      <RealTimePrices
        selectedCoinId={selectedCoinId}
        onSelectCoin={handleSelectCoin}
        initialCoins={initialCoins}
        refreshInterval={5000}
      />
    </div>
  );
};

export default RealTimeTrading;
