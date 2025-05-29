
export interface TradingSignalData {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  strategy: string;
  reasoning: string;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  enabled: boolean;
}

class N8NAutomationService {
  private webhookUrl: string | null = null;
  private workflows: WorkflowConfig[] = [];

  constructor() {
    this.webhookUrl = localStorage.getItem('n8n-webhook-url');
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    this.workflows = [
      {
        id: 'trading-signals',
        name: 'Trading Signal Distribution',
        description: 'Automatically distribute AI trading signals to Discord, Telegram, and email',
        triggers: ['ai-signal', 'manual-signal'],
        enabled: true
      },
      {
        id: 'portfolio-rebalancing',
        name: 'Portfolio Rebalancing',
        description: 'Automated portfolio optimization based on AI recommendations',
        triggers: ['portfolio-threshold', 'scheduled'],
        enabled: false
      },
      {
        id: 'risk-monitoring',
        name: 'Risk Monitoring',
        description: 'Real-time alerts when portfolio risk exceeds configured thresholds',
        triggers: ['risk-threshold', 'drawdown-alert'],
        enabled: true
      }
    ];
  }

  setWebhookUrl(url: string) {
    this.webhookUrl = url;
    localStorage.setItem('n8n-webhook-url', url);
  }

  async sendTradingSignal(signalData: TradingSignalData): Promise<boolean> {
    try {
      if (!this.webhookUrl) {
        console.log('N8N webhook not configured, signal logged locally:', signalData);
        return true;
      }

      // In a real implementation, this would send to N8N webhook
      console.log('Sending trading signal to N8N:', signalData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send trading signal:', error);
      return false;
    }
  }

  async triggerWorkflow(workflowId: string, data: any): Promise<boolean> {
    try {
      console.log(`Triggering N8N workflow ${workflowId} with data:`, data);
      
      // Simulate workflow trigger
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return true;
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      return false;
    }
  }

  getWorkflows(): WorkflowConfig[] {
    return this.workflows;
  }

  getWorkflow(id: string): WorkflowConfig | undefined {
    return this.workflows.find(w => w.id === id);
  }

  async enableWorkflow(id: string): Promise<boolean> {
    const workflow = this.workflows.find(w => w.id === id);
    if (workflow) {
      workflow.enabled = true;
      return true;
    }
    return false;
  }

  async disableWorkflow(id: string): Promise<boolean> {
    const workflow = this.workflows.find(w => w.id === id);
    if (workflow) {
      workflow.enabled = false;
      return true;
    }
    return false;
  }
}

export const n8nAutomationService = new N8NAutomationService();
