
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  rank: number;
}

export interface TradingBot {
  id: string;
  name: string;
  strategy: 'grid' | 'dca' | 'trend' | 'mean_reversion' | 'arbitrage' | 'breakout' | 'custom';
  status: 'running' | 'stopped' | 'paused';
  mode: 'paper' | 'live';
  settings: Record<string, any>;
  performance: {
    totalReturn: number;
    winRate: number;
    totalTrades: number;
    profit: number;
    loss: number;
  };
  created: string;
  lastUpdate: string;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  change24h: number;
  assets: PortfolioAsset[];
  created: string;
  updated: string;
}

export interface PortfolioAsset {
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
  avgPrice: number;
  change: number;
}

export interface Trade {
  id: string;
  botId?: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  fee: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'volume' | 'change';
  condition: 'above' | 'below';
  value: number;
  triggered: boolean;
  created: string;
}

export interface WalletConnection {
  id: string;
  name: string;
  address: string;
  balance: number;
  network: string;
  connected: boolean;
  lastSync: string;
}

interface CryptoState {
  // Market data
  assets: CryptoAsset[];
  selectedAsset: CryptoAsset | null;
  watchlist: string[];
  
  // Trading
  bots: TradingBot[];
  activeBots: string[];
  trades: Trade[];
  
  // Portfolio
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  
  // Alerts
  alerts: Alert[];
  
  // Wallets
  wallets: WalletConnection[];
  
  // Settings
  tradingMode: 'paper' | 'live';
  exchangeKeys: Record<string, string>;
  
  // Actions - Market
  updateAssets: (assets: CryptoAsset[]) => void;
  selectAsset: (asset: CryptoAsset | null) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  
  // Actions - Trading
  addBot: (bot: Omit<TradingBot, 'id' | 'created' | 'lastUpdate'>) => void;
  updateBot: (id: string, updates: Partial<TradingBot>) => void;
  deleteBot: (id: string) => void;
  startBot: (id: string) => void;
  stopBot: (id: string) => void;
  
  // Actions - Portfolio
  addPortfolio: (portfolio: Omit<Portfolio, 'id' | 'created' | 'updated'>) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  selectPortfolio: (portfolio: Portfolio | null) => void;
  
  // Actions - Alerts
  addAlert: (alert: Omit<Alert, 'id' | 'created'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  
  // Actions - Wallets
  addWallet: (wallet: Omit<WalletConnection, 'id' | 'lastSync'>) => void;
  updateWallet: (id: string, updates: Partial<WalletConnection>) => void;
  deleteWallet: (id: string) => void;
  syncWallet: (id: string) => Promise<void>;
  
  // Actions - Trading
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  
  // Actions - Settings
  setTradingMode: (mode: 'paper' | 'live') => void;
  updateExchangeKey: (exchange: string, key: string) => void;
}

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      // Initial state
      assets: [],
      selectedAsset: null,
      watchlist: ['BTC', 'ETH', 'ADA', 'SOL'],
      bots: [],
      activeBots: [],
      trades: [],
      portfolios: [],
      selectedPortfolio: null,
      alerts: [],
      wallets: [],
      tradingMode: 'paper',
      exchangeKeys: {},

      // Market actions
      updateAssets: (assets) => {
        set({ assets });
      },

      selectAsset: (asset) => {
        set({ selectedAsset: asset });
      },

      addToWatchlist: (symbol) => {
        set((state) => ({
          watchlist: [...new Set([...state.watchlist, symbol])]
        }));
      },

      removeFromWatchlist: (symbol) => {
        set((state) => ({
          watchlist: state.watchlist.filter(s => s !== symbol)
        }));
      },

      // Trading bot actions
      addBot: (botData) => {
        const bot: TradingBot = {
          ...botData,
          id: `bot-${Date.now()}`,
          created: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
          status: 'stopped',
          performance: {
            totalReturn: 0,
            winRate: 0,
            totalTrades: 0,
            profit: 0,
            loss: 0
          }
        };
        set((state) => ({ bots: [...state.bots, bot] }));
      },

      updateBot: (id, updates) => {
        set((state) => ({
          bots: state.bots.map(bot =>
            bot.id === id ? { ...bot, ...updates, lastUpdate: new Date().toISOString() } : bot
          )
        }));
      },

      deleteBot: (id) => {
        set((state) => ({
          bots: state.bots.filter(bot => bot.id !== id),
          activeBots: state.activeBots.filter(botId => botId !== id)
        }));
      },

      startBot: (id) => {
        const bot = get().bots.find(b => b.id === id);
        if (!bot) return;

        get().updateBot(id, { status: 'running' });
        set((state) => ({
          activeBots: [...new Set([...state.activeBots, id])]
        }));

        // Simulate bot trading
        setTimeout(() => {
          const mockTrade: Omit<Trade, 'id' | 'timestamp' | 'status'> = {
            botId: id,
            symbol: 'BTC',
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            amount: Math.random() * 0.1,
            price: 50000 + Math.random() * 10000,
            total: 0,
            fee: 0
          };
          mockTrade.total = mockTrade.amount * mockTrade.price;
          mockTrade.fee = mockTrade.total * 0.001;

          get().executeTrade(mockTrade);
        }, 5000);
      },

      stopBot: (id) => {
        get().updateBot(id, { status: 'stopped' });
        set((state) => ({
          activeBots: state.activeBots.filter(botId => botId !== id)
        }));
      },

      // Portfolio actions
      addPortfolio: (portfolioData) => {
        const portfolio: Portfolio = {
          ...portfolioData,
          id: `portfolio-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        set((state) => ({ portfolios: [...state.portfolios, portfolio] }));
      },

      updatePortfolio: (id, updates) => {
        set((state) => ({
          portfolios: state.portfolios.map(portfolio =>
            portfolio.id === id ? { ...portfolio, ...updates, updated: new Date().toISOString() } : portfolio
          )
        }));
      },

      deletePortfolio: (id) => {
        set((state) => ({
          portfolios: state.portfolios.filter(portfolio => portfolio.id !== id),
          selectedPortfolio: state.selectedPortfolio?.id === id ? null : state.selectedPortfolio
        }));
      },

      selectPortfolio: (portfolio) => {
        set({ selectedPortfolio: portfolio });
      },

      // Alert actions
      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          created: new Date().toISOString(),
          triggered: false
        };
        set((state) => ({ alerts: [...state.alerts, alert] }));
      },

      updateAlert: (id, updates) => {
        set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === id ? { ...alert, ...updates } : alert
          )
        }));
      },

      deleteAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== id)
        }));
      },

      triggerAlert: (id) => {
        get().updateAlert(id, { triggered: true });
      },

      // Wallet actions
      addWallet: (walletData) => {
        const wallet: WalletConnection = {
          ...walletData,
          id: `wallet-${Date.now()}`,
          lastSync: new Date().toISOString()
        };
        set((state) => ({ wallets: [...state.wallets, wallet] }));
      },

      updateWallet: (id, updates) => {
        set((state) => ({
          wallets: state.wallets.map(wallet =>
            wallet.id === id ? { ...wallet, ...updates } : wallet
          )
        }));
      },

      deleteWallet: (id) => {
        set((state) => ({
          wallets: state.wallets.filter(wallet => wallet.id !== id)
        }));
      },

      syncWallet: async (id) => {
        const wallet = get().wallets.find(w => w.id === id);
        if (!wallet) return;

        try {
          // Simulate wallet sync
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const newBalance = Math.random() * 10;
          get().updateWallet(id, { 
            balance: newBalance,
            lastSync: new Date().toISOString()
          });
        } catch (error) {
          console.error('Wallet sync failed:', error);
        }
      },

      // Trading actions
      executeTrade: async (tradeData) => {
        const trade: Trade = {
          ...tradeData,
          id: `trade-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        
        set((state) => ({ trades: [...state.trades, trade] }));

        try {
          // Simulate trade execution
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            trades: state.trades.map(t =>
              t.id === trade.id ? { ...t, status: 'completed' } : t
            )
          }));

          // Update bot performance if this was a bot trade
          if (trade.botId) {
            const bot = get().bots.find(b => b.id === trade.botId);
            if (bot) {
              const isProfit = Math.random() > 0.4; // 60% win rate
              const pnl = isProfit ? trade.total * 0.02 : -trade.total * 0.01;
              
              get().updateBot(trade.botId, {
                performance: {
                  ...bot.performance,
                  totalTrades: bot.performance.totalTrades + 1,
                  totalReturn: bot.performance.totalReturn + pnl,
                  winRate: isProfit 
                    ? (bot.performance.winRate * bot.performance.totalTrades + 1) / (bot.performance.totalTrades + 1)
                    : (bot.performance.winRate * bot.performance.totalTrades) / (bot.performance.totalTrades + 1),
                  profit: isProfit ? bot.performance.profit + pnl : bot.performance.profit,
                  loss: !isProfit ? bot.performance.loss + Math.abs(pnl) : bot.performance.loss
                }
              });
            }
          }
        } catch (error) {
          set((state) => ({
            trades: state.trades.map(t =>
              t.id === trade.id ? { ...t, status: 'cancelled' } : t
            )
          }));
        }
      },

      // Settings actions
      setTradingMode: (mode) => {
        set({ tradingMode: mode });
      },

      updateExchangeKey: (exchange, key) => {
        set((state) => ({
          exchangeKeys: { ...state.exchangeKeys, [exchange]: key }
        }));
      }
    }),
    {
      name: 'crypto-store',
      partialize: (state) => ({
        watchlist: state.watchlist,
        bots: state.bots,
        portfolios: state.portfolios,
        alerts: state.alerts,
        wallets: state.wallets,
        tradingMode: state.tradingMode,
        exchangeKeys: state.exchangeKeys
      })
    }
  )
);
