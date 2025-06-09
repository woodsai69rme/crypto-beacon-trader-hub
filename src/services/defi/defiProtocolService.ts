
import { DefiProtocol, DefiPosition } from '@/types/trading';

class DefiProtocolService {
  private protocols: DefiProtocol[] = [
    {
      id: 'aave',
      name: 'Aave',
      tvl: 12500000000,
      apy: 3.2,
      category: 'Lending',
      riskLevel: 'low',
      chain: 'Ethereum',
      logoUrl: '/logos/aave.svg',
      description: 'Decentralized lending protocol',
      url: 'https://aave.com'
    },
    {
      id: 'compound',
      name: 'Compound',
      tvl: 8200000000,
      apy: 2.8,
      category: 'Lending',
      riskLevel: 'low',
      chain: 'Ethereum',
      logoUrl: '/logos/compound.svg',
      description: 'Algorithmic money markets',
      url: 'https://compound.finance'
    },
    {
      id: 'uniswap',
      name: 'Uniswap V3',
      tvl: 6800000000,
      apy: 12.5,
      category: 'DEX',
      riskLevel: 'medium',
      chain: 'Ethereum',
      logoUrl: '/logos/uniswap.svg',
      description: 'Decentralized exchange',
      url: 'https://uniswap.org'
    },
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      tvl: 4200000000,
      apy: 18.7,
      category: 'DEX',
      riskLevel: 'medium',
      chain: 'BSC',
      logoUrl: '/logos/pancakeswap.svg',
      description: 'BSC DEX and yield farming',
      url: 'https://pancakeswap.finance'
    },
    {
      id: 'yearn',
      name: 'Yearn Finance',
      tvl: 3100000000,
      apy: 8.9,
      category: 'Yield',
      riskLevel: 'medium',
      chain: 'Ethereum',
      logoUrl: '/logos/yearn.svg',
      description: 'Yield optimization protocol',
      url: 'https://yearn.finance'
    },
    {
      id: 'curve',
      name: 'Curve Finance',
      tvl: 5600000000,
      apy: 6.3,
      category: 'DEX',
      riskLevel: 'low',
      chain: 'Ethereum',
      logoUrl: '/logos/curve.svg',
      description: 'Stablecoin exchange',
      url: 'https://curve.fi'
    }
  ];

  private userPositions: DefiPosition[] = [];

  async getAllProtocols(): Promise<DefiProtocol[]> {
    return this.protocols.sort((a, b) => b.tvl - a.tvl);
  }

  async getProtocolsByCategory(category: string): Promise<DefiProtocol[]> {
    return this.protocols.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  async getProtocolsByChain(chain: string): Promise<DefiProtocol[]> {
    return this.protocols.filter(p => p.chain.toLowerCase() === chain.toLowerCase());
  }

  async getProtocolsByRisk(riskLevel: 'low' | 'medium' | 'high'): Promise<DefiProtocol[]> {
    return this.protocols.filter(p => p.riskLevel === riskLevel);
  }

  async getUserPositions(userAddress: string): Promise<DefiPosition[]> {
    // Mock user positions - in production would fetch from blockchain
    if (this.userPositions.length === 0) {
      this.userPositions = [
        {
          id: 'aave-usdc-1',
          protocolId: 'aave',
          protocolName: 'Aave',
          asset: 'USDC',
          assetSymbol: 'USDC',
          amount: 5000,
          value: 5000,
          apy: 3.2,
          type: 'lending',
          rewards: [],
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'uniswap-eth-usdc-1',
          protocolId: 'uniswap',
          protocolName: 'Uniswap V3',
          asset: 'ETH-USDC LP',
          assetSymbol: 'ETH-USDC',
          amount: 2.5,
          value: 8500,
          apy: 12.5,
          type: 'liquidity',
          rewards: ['UNI'],
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
    return this.userPositions;
  }

  async calculateImpermanentLoss(
    token1Symbol: string,
    token2Symbol: string,
    initialPrice1: number,
    initialPrice2: number,
    currentPrice1: number,
    currentPrice2: number,
    liquidityAmount: number
  ): Promise<any> {
    const initialRatio = initialPrice1 / initialPrice2;
    const currentRatio = currentPrice1 / currentPrice2;
    
    const priceRatioChange = currentRatio / initialRatio;
    const impermanentLossPercent = (2 * Math.sqrt(priceRatioChange)) / (1 + priceRatioChange) - 1;
    
    const hodlValue = liquidityAmount;
    const lpValue = liquidityAmount * (1 + impermanentLossPercent);
    const impermanentLoss = hodlValue - lpValue;

    return {
      token1Symbol,
      token2Symbol,
      initialPrice1,
      initialPrice2,
      currentPrice1,
      currentPrice2,
      liquidityAmount,
      impermanentLoss,
      impermanentLossPercent: impermanentLossPercent * 100,
      hodlValue,
      lpValue
    };
  }

  async getYieldFarmingPools(): Promise<any[]> {
    return [
      {
        id: 'pancake-cake-bnb',
        protocol: 'PancakeSwap',
        tokenPair: 'CAKE-BNB',
        apy: 45.7,
        tvl: 125000000,
        rewards: ['CAKE'],
        risk: 'high',
        blockchain: 'BSC'
      },
      {
        id: 'uniswap-eth-usdc',
        protocol: 'Uniswap V3',
        tokenPair: 'ETH-USDC',
        apy: 12.3,
        tvl: 890000000,
        rewards: ['UNI'],
        risk: 'medium',
        blockchain: 'Ethereum'
      },
      {
        id: 'sushiswap-sushi-eth',
        protocol: 'SushiSwap',
        tokenPair: 'SUSHI-ETH',
        apy: 28.9,
        tvl: 45000000,
        rewards: ['SUSHI'],
        risk: 'medium',
        blockchain: 'Ethereum'
      }
    ];
  }

  async stakeToDeFi(protocolId: string, asset: string, amount: number): Promise<DefiPosition> {
    const protocol = this.protocols.find(p => p.id === protocolId);
    if (!protocol) throw new Error('Protocol not found');

    const newPosition: DefiPosition = {
      id: `${protocolId}-${asset}-${Date.now()}`,
      protocolId,
      protocolName: protocol.name,
      asset,
      assetSymbol: asset,
      amount,
      value: amount,
      apy: protocol.apy,
      type: 'staking',
      rewards: [],
      startDate: new Date().toISOString()
    };

    this.userPositions.push(newPosition);
    return newPosition;
  }

  async unstakeFromDeFi(positionId: string): Promise<boolean> {
    const index = this.userPositions.findIndex(p => p.id === positionId);
    if (index === -1) return false;

    this.userPositions.splice(index, 1);
    return true;
  }

  async getTotalValueLocked(): Promise<number> {
    return this.protocols.reduce((total, protocol) => total + protocol.tvl, 0);
  }

  async getProtocolAnalytics(protocolId: string): Promise<any> {
    const protocol = this.protocols.find(p => p.id === protocolId);
    if (!protocol) throw new Error('Protocol not found');

    return {
      protocol,
      monthlyVolume: protocol.tvl * 0.3,
      userCount: Math.floor(protocol.tvl / 50000),
      avgTransactionSize: protocol.tvl / 1000000,
      fees24h: protocol.tvl * 0.001,
      utilization: Math.random() * 100
    };
  }
}

export const defiProtocolService = new DefiProtocolService();
export default defiProtocolService;
