
export interface TradingSignalPayload {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  strategy: string;
  reasoning: string;
}

export interface RiskAlertPayload {
  accountId: string;
  alertType: string;
  metrics: any;
  timestamp: string;
}

export interface PortfolioRebalancePayload {
  accountId: string;
  recommendations: any[];
  timestamp: string;
}

class N8nAutomationService {
  private webhookUrl: string | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const stored = localStorage.getItem('n8n-config');
    if (stored) {
      const config = JSON.parse(stored);
      this.webhookUrl = config.webhookUrl;
      this.isEnabled = config.isEnabled;
    }
  }

  configure(webhookUrl: string, enabled: boolean = true) {
    this.webhookUrl = webhookUrl;
    this.isEnabled = enabled;
    
    localStorage.setItem('n8n-config', JSON.stringify({
      webhookUrl,
      isEnabled: enabled
    }));
  }

  async sendTradingSignal(payload: TradingSignalPayload): Promise<boolean> {
    if (!this.isEnabled || !this.webhookUrl) {
      console.log('N8N automation disabled or not configured');
      return false;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'trading_signal',
          data: payload
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send trading signal to N8N:', error);
      return false;
    }
  }

  async sendRiskAlert(payload: RiskAlertPayload): Promise<boolean> {
    if (!this.isEnabled || !this.webhookUrl) {
      console.log('N8N automation disabled or not configured');
      return false;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'risk_alert',
          data: payload
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send risk alert to N8N:', error);
      return false;
    }
  }

  async sendPortfolioRebalance(payload: PortfolioRebalancePayload): Promise<boolean> {
    if (!this.isEnabled || !this.webhookUrl) {
      console.log('N8N automation disabled or not configured');
      return false;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'portfolio_rebalance',
          data: payload
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send portfolio rebalance to N8N:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.isEnabled && !!this.webhookUrl;
  }

  getConfig() {
    return {
      webhookUrl: this.webhookUrl,
      isEnabled: this.isEnabled
    };
  }

  disable() {
    this.isEnabled = false;
    this.saveConfig();
  }

  enable() {
    this.isEnabled = true;
    this.saveConfig();
  }

  private saveConfig() {
    localStorage.setItem('n8n-config', JSON.stringify({
      webhookUrl: this.webhookUrl,
      isEnabled: this.isEnabled
    }));
  }
}

export const n8nAutomationService = new N8nAutomationService();
export default n8nAutomationService;
