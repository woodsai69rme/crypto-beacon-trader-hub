import { Trade, TradingAccount, CoinOption, RiskAlertData } from '@/types/trading';

class EnhancedRealTradingEngine {
  private activeAccounts: Map<string, TradingAccount> = new Map();
  private tradeHistory: Trade[] = [];

  constructor() {
    // Load initial accounts from local storage or database
    this.loadAccounts();
  }

  private async loadAccounts(): Promise<void> {
    // Mock loading accounts
    const mockAccount: TradingAccount = {
      id: 'mock-account-1',
      name: 'Primary Account',
      trades: [],
      balance: 10000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      type: 'paper',
      assets: [],
      isActive: true,
      initialBalance: 10000
    };

    this.activeAccounts.set(mockAccount.id, mockAccount);
    console.log('Loaded mock trading account');
  }

  async createAccount(accountDetails: Omit<TradingAccount, 'id' | 'trades' | 'createdAt' | 'assets'>): Promise<TradingAccount> {
    const newAccount: TradingAccount = {
      id: `account-${Date.now()}`,
      createdAt: new Date().toISOString(),
      trades: [],
      assets: [],
      ...accountDetails
    };

    this.activeAccounts.set(newAccount.id, newAccount);
    console.log(`Created new account: ${newAccount.name}`);
    return newAccount;
  }

  async depositFunds(accountId: string, amount: number): Promise<boolean> {
    const account = this.activeAccounts.get(accountId);
    if (!account) return false;

    account.balance += amount;
    console.log(`Deposited $${amount} into account ${account.name}`);
    return true;
  }

  async withdrawFunds(accountId: string, amount: number): Promise<boolean> {
    const account = this.activeAccounts.get(accountId);
    if (!account || account.balance < amount) return false;

    account.balance -= amount;
    console.log(`Withdrew $${amount} from account ${account.name}`);
    return true;
  }

  async executeTrade(accountId: string, tradeDetails: Omit<Trade, 'id' | 'timestamp'>): Promise<Trade | null> {
    const account = this.activeAccounts.get(accountId);
    if (!account) return null;

    const coin = this.getCoinDetails(tradeDetails.coinId);
    if (!coin) return null;

    const totalValue = tradeDetails.quantity * tradeDetails.price;

    if (tradeDetails.type === 'buy') {
      if (account.balance < totalValue) {
        await this.sendRiskAlert(account, 'insufficient_funds', 'Attempted to buy with insufficient funds');
        console.warn('Insufficient funds to execute buy trade');
        return null;
      }
      account.balance -= totalValue;
    } else if (tradeDetails.type === 'sell') {
      const asset = account.assets.find(a => a.coinId === tradeDetails.coinId);
      if (!asset || asset.amount < tradeDetails.quantity) {
        await this.sendRiskAlert(account, 'insufficient_assets', 'Attempted to sell more assets than available');
        console.warn('Insufficient assets to execute sell trade');
        return null;
      }
      account.balance += totalValue;
      asset.amount -= tradeDetails.quantity;
    }

    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...tradeDetails
    };

    this.tradeHistory.push(newTrade);
    account.trades.push(newTrade);
    await this.updateAccountAssets(account);

    console.log(`Executed ${tradeDetails.type} trade for ${tradeDetails.quantity} ${coin.symbol}`);
    return newTrade;
  }

  private async updateAccountAssets(account: TradingAccount): Promise<void> {
    const assetMap: { [coinId: string]: number } = {};

    account.trades.forEach(trade => {
      if (!trade.coinId) return;

      if (!assetMap[trade.coinId]) {
        assetMap[trade.coinId] = 0;
      }

      assetMap[trade.coinId] += (trade.type === 'buy' ? trade.quantity : -trade.quantity);
    });

    account.assets = Object.keys(assetMap).map(coinId => {
      const coin = this.getCoinDetails(coinId);
      const amount = assetMap[coinId];
      const price = coin?.price || 0;
      const value = amount * price;

      return {
        coinId: coinId,
        amount: amount,
        price: price,
        symbol: coin?.symbol || 'N/A',
        name: coin?.name || 'Unknown',
        value: value,
        allocation: value / account.balance * 100,
        change24h: Math.random() * 10 - 5,
        changePercent24h: Math.random() * 5 - 2.5
      };
    });

    console.log(`Updated assets for account ${account.name}`);
  }

  private getCoinDetails(coinId: string | undefined): CoinOption | undefined {
    // Mock coin details
    const mockCoins: CoinOption[] = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 45000,
        value: 'bitcoin',
        label: 'Bitcoin (BTC)'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3200,
        value: 'ethereum',
        label: 'Ethereum (ETH)'
      }
    ];

    return mockCoins.find(coin => coin.id === coinId);
  }

  async getAccountDetails(accountId: string): Promise<TradingAccount | undefined> {
    return this.activeAccounts.get(accountId);
  }

  getAllAccounts(): TradingAccount[] {
    return Array.from(this.activeAccounts.values());
  }

  getTradeHistory(accountId: string): Trade[] {
    const account = this.activeAccounts.get(accountId);
    return account ? account.trades : [];
  }

  private async sendRiskAlert(account: TradingAccount, alertType: string, message: string): Promise<void> {
    const alertData: RiskAlertData = {
      id: `alert-${Date.now()}`,
      type: alertType as any,
      severity: 'medium',
      message,
      recommendations: ['Review portfolio allocation', 'Consider risk management'],
      timestamp: new Date().toISOString(),
      portfolioId: account.id
    };

    // Send alert through notification system
    console.log('Risk Alert:', alertData);
  }
}

export const enhancedRealTradingEngine = new EnhancedRealTradingEngine();
export default enhancedRealTradingEngine;
