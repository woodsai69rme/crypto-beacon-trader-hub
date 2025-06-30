
export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  tags: string[];
  webhookUrl?: string;
  triggers: N8NTrigger[];
  actions: N8NAction[];
  lastRun?: string;
  status: 'active' | 'inactive' | 'error' | 'running';
  createdAt: string;
  updatedAt?: string;
}

export interface N8NTrigger {
  id: string;
  type: 'webhook' | 'schedule' | 'price_alert' | 'portfolio_change' | 'news_event' | 'technical_indicator';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface N8NAction {
  id: string;
  type: 'send_email' | 'discord_notification' | 'telegram_alert' | 'execute_trade' | 'log_event' | 'webhook_call';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface N8NWebhookData {
  timestamp: string;
  event: string;
  data: any;
  source: string;
  metadata?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  triggerData: any;
  error?: string;
  logs: string[];
}

class N8NWorkflowService {
  private baseUrl: string = '';
  private apiKey: string = '';
  private workflows: Map<string, N8NWorkflow> = new Map();

  constructor() {
    this.loadConfiguration();
    this.initializeDefaultWorkflows();
  }

  private loadConfiguration(): void {
    this.baseUrl = localStorage.getItem('n8n_base_url') || '';
    this.apiKey = localStorage.getItem('n8n_api_key') || '';
  }

  setConfiguration(baseUrl: string, apiKey: string): void {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    localStorage.setItem('n8n_base_url', baseUrl);
    localStorage.setItem('n8n_api_key', apiKey);
  }

  getConfiguration(): { baseUrl: string; apiKey: string } {
    return {
      baseUrl: this.baseUrl,
      apiKey: this.apiKey,
    };
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

      const success = response.ok;
      if (success) {
        console.log('✅ N8N webhook triggered successfully:', webhookUrl);
      } else {
        console.error('❌ N8N webhook failed:', response.statusText);
      }

      return success;
    } catch (error) {
      console.error('❌ Error triggering N8N webhook:', error);
      return false;
    }
  }

  async createWorkflow(workflow: Omit<N8NWorkflow, 'id' | 'createdAt' | 'status'>): Promise<N8NWorkflow> {
    const newWorkflow: N8NWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: workflow.isActive ? 'active' : 'inactive',
    };

    this.workflows.set(newWorkflow.id, newWorkflow);
    await this.saveWorkflows();

    console.log(`✅ Created N8N workflow: ${newWorkflow.name}`);
    return newWorkflow;
  }

  async updateWorkflow(id: string, updates: Partial<N8NWorkflow>): Promise<N8NWorkflow> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(id, updatedWorkflow);
    await this.saveWorkflows();

    console.log(`✅ Updated N8N workflow: ${updatedWorkflow.name}`);
    return updatedWorkflow;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      return false;
    }

    this.workflows.delete(id);
    await this.saveWorkflows();

    console.log(`✅ Deleted N8N workflow: ${workflow.name}`);
    return true;
  }

  async getWorkflows(): Promise<N8NWorkflow[]> {
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<N8NWorkflow | null> {
    return this.workflows.get(id) || null;
  }

  async toggleWorkflow(id: string): Promise<boolean> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      return false;
    }

    const updatedWorkflow = await this.updateWorkflow(id, {
      isActive: !workflow.isActive,
      status: !workflow.isActive ? 'active' : 'inactive',
    });

    console.log(`✅ Toggled workflow ${updatedWorkflow.name}: ${updatedWorkflow.isActive ? 'ON' : 'OFF'}`);
    return true;
  }

  async executeWorkflow(id: string, triggerData?: any): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId: id,
      status: 'running',
      startedAt: new Date().toISOString(),
      triggerData,
      logs: [`Started execution of workflow: ${workflow.name}`],
    };

    try {
      // Simulate workflow execution
      await this.simulateWorkflowExecution(workflow, execution);
      
      execution.status = 'success';
      execution.finishedAt = new Date().toISOString();
      execution.duration = Date.now() - new Date(execution.startedAt).getTime();
      execution.logs.push('Workflow execution completed successfully');

      console.log(`✅ Executed workflow: ${workflow.name}`);
    } catch (error) {
      execution.status = 'error';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.finishedAt = new Date().toISOString();
      execution.logs.push(`Error: ${execution.error}`);

      console.error(`❌ Workflow execution failed: ${workflow.name}`, error);
    }

    return execution;
  }

  // Pre-built workflow templates
  async createTradingSignalWorkflow(): Promise<N8NWorkflow> {
    return this.createWorkflow({
      name: 'Trading Signal Distribution',
      description: 'Distributes AI-generated trading signals to multiple channels',
      isActive: false,
      tags: ['trading', 'signals', 'automation'],
      webhookUrl: this.generateWebhookUrl('trading-signals'),
      triggers: [
        {
          id: 'trigger-1',
          type: 'webhook',
          name: 'Trading Signal Webhook',
          config: { method: 'POST', auth: false },
          enabled: true,
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'discord_notification',
          name: 'Send to Discord',
          config: { 
            webhook: process.env.DISCORD_WEBHOOK_URL || '',
            format: 'embed',
            includeChart: true,
          },
          enabled: true,
        },
        {
          id: 'action-2',
          type: 'telegram_alert',
          name: 'Send to Telegram',
          config: {
            botToken: process.env.TELEGRAM_BOT_TOKEN || '',
            chatId: process.env.TELEGRAM_CHAT_ID || '',
            parseMode: 'HTML',
          },
          enabled: true,
        },
      ],
    });
  }

  async createPortfolioRebalanceWorkflow(): Promise<N8NWorkflow> {
    return this.createWorkflow({
      name: 'Portfolio Auto-Rebalance',
      description: 'Automatically rebalances portfolio when allocations drift beyond threshold',
      isActive: false,
      tags: ['portfolio', 'rebalance', 'automation'],
      webhookUrl: this.generateWebhookUrl('portfolio-rebalance'),
      triggers: [
        {
          id: 'trigger-1',
          type: 'schedule',
          name: 'Daily Check',
          config: { cron: '0 9 * * *', timezone: 'UTC' },
          enabled: true,
        },
        {
          id: 'trigger-2',
          type: 'portfolio_change',
          name: 'Allocation Drift',
          config: { threshold: 5, checkInterval: 3600 },
          enabled: true,
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'log_event',
          name: 'Log Rebalance Event',
          config: { level: 'info', includePortfolioData: true },
          enabled: true,
        },
        {
          id: 'action-2',
          type: 'send_email',
          name: 'Notify User',
          config: {
            to: '${user.email}',
            subject: 'Portfolio Rebalance Alert',
            template: 'rebalance-notification',
          },
          enabled: true,
        },
      ],
    });
  }

  async createRiskMonitoringWorkflow(): Promise<N8NWorkflow> {
    return this.createWorkflow({
      name: 'Risk Level Monitoring',
      description: 'Monitors portfolio risk metrics and sends alerts when thresholds are breached',
      isActive: false,
      tags: ['risk', 'monitoring', 'alerts'],
      webhookUrl: this.generateWebhookUrl('risk-monitoring'),
      triggers: [
        {
          id: 'trigger-1',
          type: 'schedule',
          name: 'Hourly Risk Check',
          config: { cron: '0 * * * *', timezone: 'UTC' },
          enabled: true,
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'send_email',
          name: 'Risk Alert Email',
          config: {
            to: '${user.email}',
            subject: 'Risk Alert: ${risk.type}',
            template: 'risk-alert',
            priority: 'high',
          },
          enabled: true,
        },
        {
          id: 'action-2',
          type: 'discord_notification',
          name: 'Discord Risk Alert',
          config: {
            webhook: process.env.DISCORD_WEBHOOK_URL || '',
            format: 'embed',
            color: 0xff0000,
          },
          enabled: true,
        },
      ],
    });
  }

  private async simulateWorkflowExecution(workflow: N8NWorkflow, execution: WorkflowExecution): Promise<void> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    execution.logs.push(`Processing ${workflow.triggers.length} triggers`);
    execution.logs.push(`Executing ${workflow.actions.length} actions`);

    for (const action of workflow.actions) {
      if (action.enabled) {
        execution.logs.push(`Executed action: ${action.name}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  private generateWebhookUrl(workflowType: string): string {
    const baseWebhookUrl = this.baseUrl || 'https://your-n8n-instance.com';
    return `${baseWebhookUrl}/webhook/${workflowType}-${Date.now()}`;
  }

  private async saveWorkflows(): Promise<void> {
    const workflowsArray = Array.from(this.workflows.values());
    localStorage.setItem('n8n_workflows', JSON.stringify(workflowsArray));
  }

  private async loadWorkflows(): Promise<void> {
    const savedWorkflows = localStorage.getItem('n8n_workflows');
    if (savedWorkflows) {
      try {
        const workflowsArray: N8NWorkflow[] = JSON.parse(savedWorkflows);
        this.workflows.clear();
        workflowsArray.forEach(workflow => {
          this.workflows.set(workflow.id, workflow);
        });
      } catch (error) {
        console.error('Error loading saved workflows:', error);
      }
    }
  }

  private initializeDefaultWorkflows(): void {
    // Load saved workflows first
    this.loadWorkflows();

    // If no workflows exist, create default ones
    if (this.workflows.size === 0) {
      console.log('Initializing default N8N workflows...');
      // Don't await these as they're just examples
      setTimeout(() => {
        this.createTradingSignalWorkflow();
        this.createPortfolioRebalanceWorkflow();
        this.createRiskMonitoringWorkflow();
      }, 1000);
    }
  }

  // Utility methods for common workflow triggers
  async triggerTradingSignal(signalData: {
    symbol: string;
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    price: number;
    reasoning: string;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'trading_signal',
      data: signalData,
      source: 'woods-crypto-platform',
    };

    const workflows = Array.from(this.workflows.values())
      .filter(w => w.isActive && w.tags.includes('trading'));

    let success = true;
    for (const workflow of workflows) {
      if (workflow.webhookUrl) {
        const result = await this.triggerWebhook(workflow.webhookUrl, webhookData);
        success = success && result;
      }
    }

    return success;
  }

  async triggerPortfolioUpdate(portfolioData: {
    totalValue: number;
    totalReturn: number;
    assets: Array<{
      symbol: string;
      quantity: number;
      value: number;
      allocation: number;
    }>;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'portfolio_update',
      data: portfolioData,
      source: 'woods-crypto-platform',
    };

    const workflows = Array.from(this.workflows.values())
      .filter(w => w.isActive && w.tags.includes('portfolio'));

    let success = true;
    for (const workflow of workflows) {
      if (workflow.webhookUrl) {
        const result = await this.triggerWebhook(workflow.webhookUrl, webhookData);
        success = success && result;
      }
    }

    return success;
  }

  async triggerRiskAlert(riskData: {
    type: 'drawdown' | 'volatility' | 'exposure' | 'loss';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    currentValue: number;
    threshold: number;
  }): Promise<boolean> {
    const webhookData: N8NWebhookData = {
      timestamp: new Date().toISOString(),
      event: 'risk_alert',
      data: riskData,
      source: 'woods-crypto-platform',
      metadata: { priority: riskData.severity === 'critical' ? 'high' : 'normal' },
    };

    const workflows = Array.from(this.workflows.values())
      .filter(w => w.isActive && w.tags.includes('risk'));

    let success = true;
    for (const workflow of workflows) {
      if (workflow.webhookUrl) {
        const result = await this.triggerWebhook(workflow.webhookUrl, webhookData);
        success = success && result;
      }
    }

    return success;
  }
}

export const n8nWorkflowService = new N8NWorkflowService();
export default n8nWorkflowService;
