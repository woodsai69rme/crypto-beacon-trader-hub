
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

interface NFTAsset {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPrice: number;
  lastSale: number;
  owned: number;
  value: number;
  change24h: number;
}

const NFTPortfolioTracker: React.FC = () => {
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockNFTData: NFTAsset[] = [
    {
      id: '1',
      name: 'Bored Ape #1234',
      collection: 'Bored Ape Yacht Club',
      image: '/placeholder-nft.png',
      floorPrice: 15.5,
      lastSale: 18.2,
      owned: 1,
      value: 15.5,
      change24h: -2.3
    },
    {
      id: '2',
      name: 'CryptoPunk #5678',
      collection: 'CryptoPunks',
      image: '/placeholder-nft.png',
      floorPrice: 45.8,
      lastSale: 50.1,
      owned: 1,
      value: 45.8,
      change24h: 3.2
    },
    {
      id: '3',
      name: 'Azuki #9012',
      collection: 'Azuki',
      image: '/placeholder-nft.png',
      floorPrice: 8.9,
      lastSale: 9.5,
      owned: 2,
      value: 17.8,
      change24h: 1.8
    }
  ];

  const loadNFTPortfolio = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNftAssets(mockNFTData);
      setIsLoading(false);
    }, 1500);
  };

  const totalValue = nftAssets.reduce((sum, nft) => sum + nft.value, 0);
  const totalChange = nftAssets.reduce((sum, nft) => sum + (nft.value * nft.change24h / 100), 0);
  const totalChangePercent = totalValue > 0 ? (totalChange / totalValue) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          NFT Portfolio Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter wallet address (0x...)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="flex-1"
          />
          <Button onClick={loadNFTPortfolio} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load Portfolio'}
          </Button>
        </div>

        {nftAssets.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">24h Change</div>
                  <div className={`text-2xl font-bold flex items-center gap-1 ${totalChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalChangePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    {totalChangePercent > 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total NFTs</div>
                  <div className="text-2xl font-bold">{nftAssets.reduce((sum, nft) => sum + nft.owned, 0)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your NFTs</h3>
              {nftAssets.map(nft => (
                <Card key={nft.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold">{nft.name}</div>
                        <div className="text-sm text-muted-foreground">{nft.collection}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Floor: {nft.floorPrice} ETH</Badge>
                          <Badge variant="outline">Owned: {nft.owned}</Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{nft.value.toFixed(2)} ETH</div>
                        <div className={`text-sm flex items-center gap-1 ${nft.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {nft.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {nft.change24h > 0 ? '+' : ''}{nft.change24h.toFixed(2)}%
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {nftAssets.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter a wallet address to track NFT portfolio</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTPortfolioTracker;
