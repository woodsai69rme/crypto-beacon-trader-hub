
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EnhancedCryptoChart from "@/components/EnhancedCryptoChart";

const DEFAULT_COINS = [
  { id: "bitcoin", name: "Bitcoin", color: "#F7931A" },
  { id: "ethereum", name: "Ethereum", color: "#627EEA" },
  { id: "solana", name: "Solana", color: "#9945FF" },
];

const MultiCoinChart: React.FC = () => {
  const [selectedCoins, setSelectedCoins] = useState(DEFAULT_COINS);
  const [layout, setLayout] = useState<'grid' | 'stack'>('grid');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Multi-Coin Charts</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              onClick={() => setLayout('grid')}
              size="sm"
            >
              Grid
            </Button>
            <Button
              variant={layout === 'stack' ? 'default' : 'outline'}
              onClick={() => setLayout('stack')}
              size="sm"
            >
              Stack
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCoins.map((coin) => (
            <Badge key={coin.id} variant="secondary">
              {coin.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {selectedCoins.map((coin) => (
            <EnhancedCryptoChart 
              key={coin.id}
              coin={coin.name}
              coinId={coin.id}
              color={coin.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiCoinChart;
