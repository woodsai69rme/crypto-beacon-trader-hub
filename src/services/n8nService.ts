
export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  webhookUrl?: string;
  triggers: string[];
  actions: string[];
  lastRun?: string;
  status: 'active' | 'inactive' | 'error';
}

export interface N8NWebhookData {
  timestamp: string;
  event: string;
  data: any;
}

export class N8NService {
  private baseUrl: string = '';
  private apiKey: string = '';

  setConfiguration(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async triggerWebhook(webhookUrl: string, data: N8NWebhookData): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to trigger N8N webhook:', error);
      return false;
    }
  }

  async triggerPortfolioRebalance(portfolioData: {
    currentAllocation: Record<string, number>;
    targetAllocation: Record<string, number>;
    rebalanceThreshold: number;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'portfolio_rebalance',
      data: portfolioData
    };

    // This would be configured with actual N8N webhook URL
    const webhookUrl = localStorage.getItem('n8n_rebalance_webhook') || '';
    
    if (!webhookUrl) {
      console.warn('N8N rebalance webhook URL not configured');
      return false;
    }

    return this.triggerWebhook(webhookUrl, webhookData);
  }

  async checkRiskLevels(riskData: {
    portfolioValue: number;
    drawdown: number;
    volatility: number;
    correlations: Record<string, number>;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'risk_assessment',
      data: riskData
    };

    const webhookUrl = localStorage.getItem('n8n_risk_webhook') || '';
    
    if (!webhookUrl) {
      console.warn('N8N risk assessment webhook URL not configured');
      return false;
    }

    return this.triggerWebhook(webhookUrl, webhookData);
  }

  async sendTradingSignal(signalData: {
    asset: string;
    signal: 'buy' | 'sell' | 'hold';
    strength: number;
    price: number;
    reasoning: string;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'trading_signal',
      data: signalData
    };

    const webhookUrl = localStorage.getItem('n8n_signal_webhook') || '';
    
    if (!webhookUrl) {
      console.warn('N8N trading signal webhook URL not configured');
      return false;
    }

    return this.triggerWebhook(webhookUrl, webhookData);
  }

  async getWorkflows(): Promise<N8NWorkflow[]> {
    // Mock workflows for now
    return [
      {
        id: 'portfolio-rebalance',
        name: 'Portfolio Auto-Rebalance',
        description: 'Automatically rebalances portfolio when allocations drift beyond threshold',
        isActive: true,
        webhookUrl: 'https://your-n8n-instance.com/webhook/portfolio-rebalance',
        triggers: ['portfolio_drift', 'scheduled_check'],
        actions: ['send_alert', 'execute_trades', 'log_activity'],
        lastRun: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'risk-monitoring',
        name: 'Risk Level Monitoring',
        description: 'Monitors portfolio risk metrics and sends alerts',
        isActive: true,
        webhookUrl: 'https://your-n8n-instance.com/webhook/risk-monitor',
        triggers: ['risk_threshold_breach', 'market_volatility'],
        actions: ['send_email', 'slack_notification', 'reduce_positions'],
        lastRun: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'trading-signals',
        name: 'Trading Signal Distribution',
        description: 'Distributes AI-generated trading signals to various channels',
        isActive: false,
        webhookUrl: 'https://your-n8n-instance.com/webhook/trading-signals',
        triggers: ['ai_signal_generated', 'technical_indicator'],
        actions: ['discord_notification', 'telegram_alert', 'portfolio_update'],
        status: 'inactive'
      }
    ];
  }

  async createWorkflow(workflow: Omit<N8NWorkflow, 'id' | 'lastRun' | 'status'>): Promise<N8NWorkflow> {
    // Mock creation - in real implementation would call N8N API
    const newWorkflow: N8NWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      lastRun: undefined,
      status: workflow.isActive ? 'active' : 'inactive'
    };

    return newWorkflow;
  }

  async updateWorkflow(id: string, updates: Partial<N8NWorkflow>): Promise<N8NWorkflow> {
    // Mock update - in real implementation would call N8N API
    const workflows = await this.getWorkflows();
    const workflow = workflows.find(w => w.id === id);
    
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    return { ...workflow, ...updates };
  }

  async toggleWorkflow(id: string): Promise<boolean> {
    try {
      const workflows = await this.getWorkflows();
      const workflow = workflows.find(w => w.id === id);
      
      if (!workflow) {
        throw new Error(`Workflow ${id} not found`);
      }

      await this.updateWorkflow(id, { 
        isActive: !workflow.isActive,
        status: !workflow.isActive ? 'active' : 'inactive'
      });

      return true;
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
      return false;
    }
  }
}

export const n8nService = new N8NService();
