
export interface TradingSignalData {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  strategy: string;
  reasoning: string;
}

export class N8NAutomationService {
  async sendTradingSignal(signalData: TradingSignalData): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_signal_webhook');
      
      if (!webhookUrl) {
        console.warn('N8N trading signal webhook not configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'trading_signal',
          data: signalData
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send trading signal to N8N:', error);
      return false;
    }
  }

  async sendPortfolioUpdate(portfolioData: any): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_rebalance_webhook');
      
      if (!webhookUrl) {
        console.warn('N8N portfolio webhook not configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'portfolio_update',
          data: portfolioData
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send portfolio update to N8N:', error);
      return false;
    }
  }

  async sendRiskAlert(riskData: any): Promise<boolean> {
    try {
      const webhookUrl = localStorage.getItem('n8n_risk_webhook');
      
      if (!webhookUrl) {
        console.warn('N8N risk webhook not configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'risk_alert',
          data: riskData
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send risk alert to N8N:', error);
      return false;
    }
  }
}

export const n8nAutomationService = new N8NAutomationService();
