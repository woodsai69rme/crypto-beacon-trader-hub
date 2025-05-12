
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  Star, 
  TrendingUp, 
  BarChart2, 
  Trash2, 
  Edit, 
  PlayCircle,
  PlusCircle,
  ChevronRight
} from "lucide-react";
import { AITradingStrategy } from '@/types/trading';
import { useNavigate } from 'react-router-dom';

const mockPrebuiltStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'BTC Momentum',
    description: 'Takes advantage of BTC price momentum with RSI confirmation',
    type: 'momentum',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 68,
      returnRate: 34.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5,
    },
    risk: 6.5,
    return: 34.2,
  },
  {
    id: 'strategy-2',
    name: 'ETH/BTC Pair',
    description: 'Arbitrage between ETH and BTC price movements',
    type: 'arbitrage',
    timeframe: '1d',
    riskLevel: 'low',
    parameters: {
      period: 21,
      threshold: 65,
    },
    assets: ['ethereum', 'bitcoin'],
    performance: {
      winRate: 72,
      returnRate: 28.4,
      sharpeRatio: 1.9,
      maxDrawdown: 9.2,
    },
    risk: 4.2,
    return: 28.4,
  },
  {
    id: 'strategy-3',
    name: 'SOL Breakout',
    description: 'Detects SOL breakouts with volume confirmation',
    type: 'breakout',
    timeframe: '1h',
    riskLevel: 'high',
    parameters: {
      period: 7,
      threshold: 80,
    },
    assets: ['solana'],
    performance: {
      winRate: 58,
      returnRate: 47.5,
      sharpeRatio: 1.6,
      maxDrawdown: 22.4,
    },
    risk: 8.7,
    return: 47.5,
  },
  {
    id: 'strategy-4',
    name: 'BTC/ETH/SOL Diversified',
    description: 'Balanced allocation across top 3 cryptos with periodic rebalancing',
    type: 'diversification',
    timeframe: '1w',
    riskLevel: 'low',
    parameters: {
      period: 30,
      threshold: 60,
    },
    assets: ['bitcoin', 'ethereum', 'solana'],
    performance: {
      winRate: 75,
      returnRate: 23.8,
      sharpeRatio: 2.4,
      maxDrawdown: 7.8,
    },
    risk: 3.8,
    return: 23.8,
  },
  {
    id: 'strategy-5',
    name: 'XRP Swing',
    description: 'Captures XRP price swings using MACD and RSI',
    type: 'swing',
    timeframe: '12h',
    riskLevel: 'medium',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    assets: ['ripple'],
    performance: {
      winRate: 62,
      returnRate: 31.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15.2,
    },
    risk: 6.2,
    return: 31.5,
  },
];

const mockUserStrategies: AITradingStrategy[] = [
  {
    id: 'user-strategy-1',
    name: 'My BTC Day Trader',
    description: 'Custom day trading strategy for Bitcoin using moving average crossovers',
    type: 'custom',
    timeframe: '1h',
    riskLevel: 'high',
    parameters: {
      fastPeriod: 9,
      slowPeriod: 21,
      signalPeriod: 9,
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 54,
      returnRate: 42.5,
      sharpeRatio: 1.4,
      maxDrawdown: 18.5,
    },
    risk: 8.5,
    return: 42.5,
  },
  {
    id: 'user-strategy-2',
    name: 'ETH/SOL Portfolio',
    description: 'Balanced portfolio allocation between ETH and SOL with monthly rebalancing',
    type: 'custom',
    timeframe: '1d',
    riskLevel: 'medium',
    parameters: {
      rebalancePeriod: 30,
      ethAllocation: 60,
      solAllocation: 40,
    },
    assets: ['ethereum', 'solana'],
    performance: {
      winRate: 65,
      returnRate: 29.8,
      sharpeRatio: 1.7,
      maxDrawdown: 14.2,
    },
    risk: 6.8,
    return: 29.8,
  },
];

const AIStrategiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('prebuilt');
  const navigate = useNavigate();
  
  const handleCreateStrategy = () => {
    navigate('/builder');
  };
  
  const handleEditStrategy = (strategyId: string) => {
    navigate(`/builder?id=${strategyId}`);
  };
  
  const handleBacktestStrategy = (strategyId: string) => {
    navigate(`/backtest?id=${strategyId}`);
  };
  
  const handleDeleteStrategy = (strategyId: string) => {
    // In a real app, we would delete the strategy from the database
    console.log(`Delete strategy: ${strategyId}`);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Trading Strategies
          </h1>
          <p className="text-muted-foreground">
            Discover and manage AI-powered trading strategies
          </p>
        </div>
        
        <Button onClick={handleCreateStrategy} className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Strategy
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="prebuilt" className="flex-1 md:flex-none">Prebuilt Strategies</TabsTrigger>
          <TabsTrigger value="my-strategies" className="flex-1 md:flex-none">My Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prebuilt">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPrebuiltStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onEdit={() => handleEditStrategy(strategy.id)}
                onBacktest={() => handleBacktestStrategy(strategy.id)}
                showControls={false}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-strategies">
          {mockUserStrategies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onEdit={() => handleEditStrategy(strategy.id)}
                  onBacktest={() => handleBacktestStrategy(strategy.id)}
                  onDelete={() => handleDeleteStrategy(strategy.id)}
                  showControls={true}
                />
              ))}
            </div>
          ) : (
            <Card className="w-full p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-4 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No Custom Strategies Yet</h3>
                <p className="text-sm mb-4">
                  Create your first custom trading strategy to get started.
                </p>
                <Button onClick={handleCreateStrategy}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Strategy
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StrategyCardProps {
  strategy: AITradingStrategy;
  showControls: boolean;
  onEdit: () => void;
  onBacktest: () => void;
  onDelete?: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  showControls,
  onEdit,
  onBacktest,
  onDelete
}) => {
  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span>{strategy.name}</span>
          </CardTitle>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(strategy.riskLevel)}`}>
            {strategy.riskLevel}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <MetricCard
            title="Return"
            value={`${strategy.return?.toFixed(1)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            isPositive={true}
          />
          <MetricCard
            title="Risk"
            value={strategy.risk?.toFixed(1) || "N/A"}
            icon={<BarChart2 className="h-4 w-4" />}
            isPositive={false}
          />
          <MetricCard
            title="Sharpe Ratio"
            value={strategy.performance?.sharpeRatio.toFixed(1) || "N/A"}
            icon={<Star className="h-4 w-4" />}
            isPositive={true}
          />
          <MetricCard
            title="Win Rate"
            value={`${strategy.performance?.winRate.toFixed(0) || "N/A"}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            isPositive={true}
          />
        </div>
        
        <div className="text-xs text-muted-foreground mb-4">
          <div className="flex justify-between mb-1">
            <span>Assets:</span>
            <span>{strategy.assets?.map(asset => asset.toUpperCase()).join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Timeframe:</span>
            <span>{strategy.timeframe}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button variant="default" size="sm" className="w-full" onClick={onBacktest}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Backtest
          </Button>
          
          {showControls && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {onDelete && (
                <Button variant="outline" size="sm" className="flex-1" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
          
          {!showControls && (
            <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
              <span>Customize</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  isPositive
}) => {
  return (
    <div className={`p-2 rounded-md border ${isPositive ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="flex items-center gap-1 mt-1">
        <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {icon}
        </div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
};

export default AIStrategiesPage;
