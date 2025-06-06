
export interface TradingSignalData {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  strategy: string;
  reasoning: string;
}

export interface PortfolioUpdateData {
  totalValue: number;
  totalReturn: number;
  assets: Array<{
    symbol: string;
    quantity: number;
    value: number;
    allocation: number;
  }>;
  rebalanceRecommendations?: Array<{
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    reason: string;
  }>;
}

export interface RiskAlertData {
  type: 'drawdown' | 'volatility' | 'exposure' | 'loss';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentValue: number;
  threshold: number;
  recommendations: string[];
}

export class N8NAutomationService {
  private readonly baseWebhookUrl = 'https://your-n8n-instance.com/webhook';

  async sendTradingSignal(signalData: TradingSignalData): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_signal_webhook') || `${this.baseWebhookUrl}/trading-signal`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'trading_signal',
          data: signalData,
          source: 'crypto-ai-platform'
        }),
      });

      if (response.ok) {
        console.log('✅ Trading signal sent to N8N successfully');
        return true;
      } else {
        console.error('❌ Failed to send trading signal to N8N:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending trading signal to N8N:', error);
      return false;
    }
  }

  async sendPortfolioUpdate(portfolioData: PortfolioUpdateData): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_portfolio_webhook') || `${this.baseWebhookUrl}/portfolio-update`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'portfolio_update',
          data: portfolioData,
          source: 'crypto-ai-platform'
        }),
      });

      if (response.ok) {
        console.log('✅ Portfolio update sent to N8N successfully');
        return true;
      } else {
        console.error('❌ Failed to send portfolio update to N8N:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending portfolio update to N8N:', error);
      return false;
    }
  }

  async sendRiskAlert(riskData: RiskAlertData): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_risk_webhook') || `${this.baseWebhookUrl}/risk-alert`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'risk_alert',
          data: riskData,
          source: 'crypto-ai-platform',
          priority: riskData.severity === 'critical' ? 'high' : 'normal'
        }),
      });

      if (response.ok) {
        console.log('✅ Risk alert sent to N8N successfully');
        return true;
      } else {
        console.error('❌ Failed to send risk alert to N8N:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending risk alert to N8N:', error);
      return false;
    }
  }

  async sendCustomEvent(eventType: string, data: any): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_custom_webhook') || `${this.baseWebhookUrl}/custom-event`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: eventType,
          data: data,
          source: 'crypto-ai-platform'
        }),
      });

      if (response.ok) {
        console.log(`✅ Custom event ${eventType} sent to N8N successfully`);
        return true;
      } else {
        console.error(`❌ Failed to send custom event ${eventType} to N8N:`, response.statusText);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error sending custom event ${eventType} to N8N:`, error);
      return false;
    }
  }

  // Configuration methods
  setSignalWebhook(url: string): void {
    localStorage.setItem('n8n_signal_webhook', url);
  }

  setPortfolioWebhook(url: string): void {
    localStorage.setItem('n8n_portfolio_webhook', url);
  }

  setRiskWebhook(url: string): void {
    localStorage.setItem('n8n_risk_webhook', url);
  }

  setCustomWebhook(url: string): void {
    localStorage.setItem('n8n_custom_webhook', url);
  }

  getWebhookConfiguration(): {
    signal?: string;
    portfolio?: string;
    risk?: string;
    custom?: string;
  } {
    return {
      signal: localStorage.getItem('n8n_signal_webhook') || undefined,
      portfolio: localStorage.getItem('n8n_portfolio_webhook') || undefined,
      risk: localStorage.getItem('n8n_risk_webhook') || undefined,
      custom: localStorage.getItem('n8n_custom_webhook') || undefined
    };
  }

  isConfigured(): boolean {
    const config = this.getWebhookConfiguration();
    return !!(config.signal || config.portfolio || config.risk || config.custom);
  }
}

export const n8nAutomationService = new N8NAutomationService();
export default n8nAutomationService;
