import { toast } from "@/hooks/use-toast";

interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  webhookUrl: string;
  triggerType: 'webhook' | 'schedule' | 'manual';
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  nodes: N8NNode[];
}

interface N8NNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  connections: Record<string, any>;
}

interface TradingSignal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  strategy: string;
  reasoning: string;
}

interface AutomationTrigger {
  id: string;
  type: 'price_alert' | 'sentiment_change' | 'portfolio_rebalance' | 'news_event';
  conditions: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
}

interface AutomationAction {
  type: 'send_webhook' | 'place_order' | 'send_notification' | 'rebalance_portfolio';
  parameters: Record<string, any>;
}

class N8NAutomationService {
  private workflows: Map<string, N8NWorkflow> = new Map();
  private triggers: Map<string, AutomationTrigger> = new Map();
  private baseUrl = 'http://localhost:5678'; // Default N8N instance
  private apiKey: string | null = null;
  private webhookEndpoints: Map<string, string> = new Map();

  constructor() {
    this.loadStoredWorkflows();
    this.initializeDefaultWorkflows();
    this.setupWebhookEndpoints();
  }

  private loadStoredWorkflows() {
    try {
      const stored = localStorage.getItem('n8n-workflows');
      if (stored) {
        const workflows = JSON.parse(stored);
        workflows.forEach((workflow: N8NWorkflow) => {
          this.workflows.set(workflow.id, workflow);
        });
      }
    } catch (error) {
      console.error('Failed to load stored workflows:', error);
    }
  }

  private saveWorkflows() {
    try {
      const workflows = Array.from(this.workflows.values());
      localStorage.setItem('n8n-workflows', JSON.stringify(workflows));
    } catch (error) {
      console.error('Failed to save workflows:', error);
    }
  }

  private initializeDefaultWorkflows() {
    const defaultWorkflows = [
      {
        id: 'trading-signal-distributor',
        name: 'Trading Signal Distributor',
        description: 'Automatically distribute AI-generated trading signals to connected platforms',
        isActive: false,
        webhookUrl: `${this.baseUrl}/webhook/trading-signals`,
        triggerType: 'webhook' as const,
        runCount: 0,
        successRate: 0,
        nodes: [
          {
            id: 'webhook-trigger',
            type: 'n8n-nodes-base.webhook',
            name: 'Trading Signal Webhook',
            position: { x: 100, y: 100 },
            parameters: {
              httpMethod: 'POST',
              path: 'trading-signals'
            },
            connections: {}
          },
          {
            id: 'signal-processor',
            type: 'n8n-nodes-base.function',
            name: 'Process Signal',
            position: { x: 300, y: 100 },
            parameters: {
              functionCode: `
                const signal = $input.first().json;
                
                // Validate signal
                if (!signal.symbol || !signal.signal || !signal.confidence) {
                  throw new Error('Invalid trading signal format');
                }
                
                // Add metadata
                signal.processedAt = new Date().toISOString();
                signal.source = 'ai-trading-bot';
                
                return { json: signal };
              `
            },
            connections: {}
          },
          {
            id: 'discord-notification',
            type: 'n8n-nodes-base.discord',
            name: 'Send Discord Alert',
            position: { x: 500, y: 50 },
            parameters: {
              webhookUrl: 'DISCORD_WEBHOOK_URL',
              content: '🚨 **Trading Signal Alert** 🚨\n\n' +
                      '**Symbol:** {{$json["symbol"]}}\n' +
                      '**Signal:** {{$json["signal"]}}\n' +
                      '**Confidence:** {{$json["confidence"]}}%\n' +
                      '**Price:** ${{$json["price"]}}\n' +
                      '**Strategy:** {{$json["strategy"]}}\n' +
                      '**Reasoning:** {{$json["reasoning"]}}'
            },
            connections: {}
          },
          {
            id: 'telegram-notification',
            type: 'n8n-nodes-base.telegram',
            name: 'Send Telegram Alert',
            position: { x: 500, y: 150 },
            parameters: {
              operation: 'sendMessage',
              chatId: 'TELEGRAM_CHAT_ID',
              text: '🚨 Trading Signal Alert 🚨\n\n' +
                    'Symbol: {{$json["symbol"]}}\n' +
                    'Signal: {{$json["signal"]}}\n' +
                    'Confidence: {{$json["confidence"]}}%\n' +
                    'Price: ${{$json["price"]}}\n' +
                    'Strategy: {{$json["strategy"]}}\n' +
                    'Reasoning: {{$json["reasoning"]}}'
            },
            connections: {}
          }
        ]
      },
      {
        id: 'portfolio-rebalancer',
        name: 'Automated Portfolio Rebalancer',
        description: 'Automatically rebalance portfolio based on AI recommendations',
        isActive: false,
        webhookUrl: `${this.baseUrl}/webhook/portfolio-rebalance`,
        triggerType: 'schedule' as const,
        schedule: '0 */6 * * *', // Every 6 hours
        runCount: 0,
        successRate: 0,
        nodes: [
          {
            id: 'schedule-trigger',
            type: 'n8n-nodes-base.cron',
            name: 'Rebalance Schedule',
            position: { x: 100, y: 100 },
            parameters: {
              expression: '0 */6 * * *'
            },
            connections: {}
          },
          {
            id: 'portfolio-analyzer',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Get Portfolio Analysis',
            position: { x: 300, y: 100 },
            parameters: {
              method: 'GET',
              url: 'http://localhost:3000/api/portfolio/analysis',
              authentication: 'headerAuth',
              headerAuth: {
                name: 'Authorization',
                value: 'Bearer {{$env.API_KEY}}'
              }
            },
            connections: {}
          },
          {
            id: 'rebalance-decision',
            type: 'n8n-nodes-base.function',
            name: 'Rebalance Decision',
            position: { x: 500, y: 100 },
            parameters: {
              functionCode: `
                const portfolio = $input.first().json;
                
                // Check if rebalancing is needed
                const maxDeviation = 0.05; // 5% deviation threshold
                let needsRebalancing = false;
                
                for (const asset of portfolio.assets) {
                  const deviation = Math.abs(asset.currentAllocation - asset.targetAllocation);
                  if (deviation > maxDeviation) {
                    needsRebalancing = true;
                    break;
                  }
                }
                
                return { 
                  json: { 
                    ...portfolio, 
                    needsRebalancing,
                    timestamp: new Date().toISOString()
                  } 
                };
              `
            },
            connections: {}
          }
        ]
      },
      {
        id: 'sentiment-analyzer',
        name: 'Real-time Sentiment Analyzer',
        description: 'Analyze social media sentiment and generate trading signals',
        isActive: false,
        webhookUrl: `${this.baseUrl}/webhook/sentiment-analysis`,
        triggerType: 'schedule' as const,
        schedule: '*/15 * * * *', // Every 15 minutes
        runCount: 0,
        successRate: 0,
        nodes: [
          {
            id: 'sentiment-trigger',
            type: 'n8n-nodes-base.cron',
            name: 'Sentiment Check',
            position: { x: 100, y: 100 },
            parameters: {
              expression: '*/15 * * * *'
            },
            connections: {}
          },
          {
            id: 'reddit-scraper',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Scrape Reddit',
            position: { x: 300, y: 50 },
            parameters: {
              method: 'GET',
              url: 'https://www.reddit.com/r/CryptoCurrency/hot.json?limit=50'
            },
            connections: {}
          },
          {
            id: 'twitter-monitor',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Monitor Twitter',
            position: { x: 300, y: 150 },
            parameters: {
              method: 'GET',
              url: 'https://api.twitter.com/2/tweets/search/recent?query=bitcoin OR ethereum crypto',
              authentication: 'headerAuth'
            },
            connections: {}
          },
          {
            id: 'sentiment-processor',
            type: 'n8n-nodes-base.openAi',
            name: 'AI Sentiment Analysis',
            position: { x: 500, y: 100 },
            parameters: {
              operation: 'chat',
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'Analyze cryptocurrency sentiment from social media posts. Return JSON with sentiment (bullish/bearish/neutral) and confidence score.'
                },
                {
                  role: 'user',
                  content: '{{$json["text"]}}'
                }
              ]
            },
            connections: {}
          }
        ]
      },
      {
        id: 'risk-monitor',
        name: 'Portfolio Risk Monitor',
        description: 'Monitor portfolio risk and trigger alerts when thresholds are exceeded',
        isActive: false,
        webhookUrl: `${this.baseUrl}/webhook/risk-monitor`,
        triggerType: 'schedule' as const,
        schedule: '*/30 * * * *', // Every 30 minutes
        runCount: 0,
        successRate: 0,
        nodes: [
          {
            id: 'risk-trigger',
            type: 'n8n-nodes-base.cron',
            name: 'Risk Check',
            position: { x: 100, y: 100 },
            parameters: {
              expression: '*/30 * * * *'
            },
            connections: {}
          },
          {
            id: 'portfolio-risk',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Calculate Portfolio Risk',
            position: { x: 300, y: 100 },
            parameters: {
              method: 'POST',
              url: 'http://localhost:3000/api/portfolio/risk-analysis',
              body: JSON.stringify({
                includeCorrelations: true,
                timeframe: '30d'
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            },
            connections: {}
          },
          {
            id: 'risk-alert',
            type: 'n8n-nodes-base.function',
            name: 'Risk Alert Logic',
            position: { x: 500, y: 100 },
            parameters: {
              functionCode: `
                const risk = $input.first().json;
                
                const alerts = [];
                
                // Check VaR threshold
                if (risk.valueAtRisk > 0.05) { // 5% VaR threshold
                  alerts.push({
                    type: 'high_var',
                    message: 'Portfolio VaR exceeds 5% threshold',
                    value: risk.valueAtRisk,
                    severity: 'high'
                  });
                }
                
                // Check concentration risk
                if (risk.maxAssetWeight > 0.4) { // 40% concentration threshold
                  alerts.push({
                    type: 'concentration_risk',
                    message: 'Single asset concentration exceeds 40%',
                    value: risk.maxAssetWeight,
                    severity: 'medium'
                  });
                }
                
                // Check correlation risk
                if (risk.avgCorrelation > 0.8) { // 80% correlation threshold
                  alerts.push({
                    type: 'correlation_risk',
                    message: 'Portfolio correlation is too high',
                    value: risk.avgCorrelation,
                    severity: 'medium'
                  });
                }
                
                return { json: { alerts, timestamp: new Date().toISOString() } };
              `
            },
            connections: {}
          }
        ]
      }
    ];

    defaultWorkflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });

    this.saveWorkflows();
  }

  private setupWebhookEndpoints() {
    // Set up webhook endpoints for different automation types
    this.webhookEndpoints.set('trading-signals', '/webhook/trading-signals');
    this.webhookEndpoints.set('portfolio-rebalance', '/webhook/portfolio-rebalance');
    this.webhookEndpoints.set('sentiment-analysis', '/webhook/sentiment-analysis');
    this.webhookEndpoints.set('risk-alerts', '/webhook/risk-alerts');
    this.webhookEndpoints.set('news-events', '/webhook/news-events');
  }

  async sendTradingSignal(signal: TradingSignal): Promise<boolean> {
    try {
      const webhookUrl = this.webhookEndpoints.get('trading-signals');
      if (!webhookUrl) {
        throw new Error('Trading signals webhook not configured');
      }

      const response = await fetch(`${this.baseUrl}${webhookUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify(signal)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      toast({
        title: "Trading Signal Sent",
        description: `${signal.signal} signal for ${signal.symbol} distributed to automation workflows`,
      });

      return true;
    } catch (error) {
      console.error('Failed to send trading signal:', error);
      toast({
        title: "Signal Distribution Failed",
        description: "Failed to send trading signal to automation workflows",
        variant: "destructive",
      });
      return false;
    }
  }

  async triggerPortfolioRebalance(portfolioData: any): Promise<boolean> {
    try {
      const webhookUrl = this.webhookEndpoints.get('portfolio-rebalance');
      if (!webhookUrl) {
        throw new Error('Portfolio rebalance webhook not configured');
      }

      const response = await fetch(`${this.baseUrl}${webhookUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          ...portfolioData,
          timestamp: new Date().toISOString(),
          source: 'crypto-trading-platform'
        })
      });

      if (!response.ok) {
        throw new Error(`Rebalance webhook failed: ${response.statusText}`);
      }

      toast({
        title: "Portfolio Rebalance Triggered",
        description: "Automated portfolio rebalancing workflow has been initiated",
      });

      return true;
    } catch (error) {
      console.error('Failed to trigger portfolio rebalance:', error);
      toast({
        title: "Rebalance Failed",
        description: "Failed to trigger portfolio rebalancing workflow",
        variant: "destructive",
      });
      return false;
    }
  }

  async sendRiskAlert(riskData: any): Promise<boolean> {
    try {
      const webhookUrl = this.webhookEndpoints.get('risk-alerts');
      if (!webhookUrl) {
        throw new Error('Risk alerts webhook not configured');
      }

      const response = await fetch(`${this.baseUrl}${webhookUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          ...riskData,
          timestamp: new Date().toISOString(),
          platform: 'crypto-trading-platform'
        })
      });

      if (!response.ok) {
        throw new Error(`Risk alert webhook failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to send risk alert:', error);
      return false;
    }
  }

  async createCustomWorkflow(workflow: Partial<N8NWorkflow>): Promise<string> {
    const workflowId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newWorkflow: N8NWorkflow = {
      id: workflowId,
      name: workflow.name || 'Custom Workflow',
      description: workflow.description || 'User-created automation workflow',
      isActive: false,
      webhookUrl: `${this.baseUrl}/webhook/${workflowId}`,
      triggerType: workflow.triggerType || 'webhook',
      schedule: workflow.schedule,
      runCount: 0,
      successRate: 0,
      nodes: workflow.nodes || []
    };

    this.workflows.set(workflowId, newWorkflow);
    this.saveWorkflows();

    toast({
      title: "Workflow Created",
      description: `Custom workflow "${newWorkflow.name}" has been created`,
    });

    return workflowId;
  }

  async activateWorkflow(workflowId: string): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    try {
      // In a real implementation, this would activate the workflow in N8N
      workflow.isActive = true;
      this.workflows.set(workflowId, workflow);
      this.saveWorkflows();

      toast({
        title: "Workflow Activated",
        description: `Workflow "${workflow.name}" is now active`,
      });

      return true;
    } catch (error) {
      console.error('Failed to activate workflow:', error);
      toast({
        title: "Activation Failed",
        description: `Failed to activate workflow "${workflow.name}"`,
        variant: "destructive",
      });
      return false;
    }
  }

  async deactivateWorkflow(workflowId: string): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    try {
      workflow.isActive = false;
      this.workflows.set(workflowId, workflow);
      this.saveWorkflows();

      toast({
        title: "Workflow Deactivated",
        description: `Workflow "${workflow.name}" has been deactivated`,
      });

      return true;
    } catch (error) {
      console.error('Failed to deactivate workflow:', error);
      return false;
    }
  }

  async triggerWorkflow(workflowId: string, data: Record<string, any>): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      console.error(`Workflow ${workflowId} not found`);
      return false;
    }

    if (!workflow.isActive) {
      console.error(`Workflow ${workflowId} is not active`);
      return false;
    }

    try {
      const response = await fetch(workflow.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'crypto-trading-platform'
        })
      });

      if (!response.ok) {
        throw new Error(`Workflow trigger failed: ${response.statusText}`);
      }

      console.log(`Workflow ${workflowId} triggered successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to trigger workflow ${workflowId}:`, error);
      return false;
    }
  }

  getWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(workflowId: string): N8NWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  getActiveWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values()).filter(workflow => workflow.isActive);
  }

  setN8NConfig(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || null;
    
    // Update webhook URLs
    this.workflows.forEach(workflow => {
      workflow.webhookUrl = workflow.webhookUrl.replace(/^https?:\/\/[^\/]+/, this.baseUrl);
    });
    
    this.saveWorkflows();
  }

  getN8NConfig() {
    return {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      webhookEndpoints: Object.fromEntries(this.webhookEndpoints)
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      return response.ok;
    } catch (error) {
      console.error('N8N connection test failed:', error);
      return false;
    }
  }
}

export const n8nAutomationService = new N8NAutomationService();
export default n8nAutomationService;
