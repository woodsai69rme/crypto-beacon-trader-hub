
import { toast } from "@/hooks/use-toast";

interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
}

interface N8NWebhookPayload {
  timestamp: string;
  source: string;
  data: Record<string, any>;
  workflow_id?: string;
}

class N8NService {
  private workflows: Map<string, N8NWorkflow> = new Map();
  private baseUrl = 'https://n8n.lovable.app'; // Replace with actual N8N instance

  constructor() {
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    const defaultWorkflows: N8NWorkflow[] = [
      {
        id: 'trading-alerts',
        name: 'Trading Alerts Workflow',
        description: 'Processes trading signals and sends alerts',
        webhookUrl: `${this.baseUrl}/webhook/trading-alerts`,
        isActive: true,
        triggers: ['price_alert', 'volume_spike', 'technical_indicator'],
        actions: ['send_email', 'push_notification', 'discord_message']
      },
      {
        id: 'portfolio-rebalance',
        name: 'Portfolio Rebalancing',
        description: 'Automatically rebalances portfolio based on set rules',
        webhookUrl: `${this.baseUrl}/webhook/portfolio-rebalance`,
        isActive: true,
        triggers: ['scheduled_daily', 'deviation_threshold'],
        actions: ['calculate_allocation', 'execute_trades', 'send_report']
      },
      {
        id: 'news-sentiment',
        name: 'News Sentiment Analysis',
        description: 'Analyzes crypto news sentiment and triggers actions',
        webhookUrl: `${this.baseUrl}/webhook/news-sentiment`,
        isActive: true,
        triggers: ['new_article', 'sentiment_change'],
        actions: ['analyze_sentiment', 'update_signals', 'notify_users']
      },
      {
        id: 'risk-management',
        name: 'Risk Management Workflow',
        description: 'Monitors portfolio risk and takes protective actions',
        webhookUrl: `${this.baseUrl}/webhook/risk-management`,
        isActive: true,
        triggers: ['portfolio_drawdown', 'volatility_spike', 'correlation_change'],
        actions: ['reduce_exposure', 'hedge_positions', 'alert_user']
      },
      {
        id: 'social-sentiment',
        name: 'Social Media Sentiment Tracking',
        description: 'Tracks sentiment from Twitter, Reddit, and other sources',
        webhookUrl: `${this.baseUrl}/webhook/social-sentiment`,
        isActive: true,
        triggers: ['mention_threshold', 'sentiment_shift'],
        actions: ['aggregate_sentiment', 'generate_signals', 'update_dashboard']
      }
    ];

    defaultWorkflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  async triggerWorkflow(workflowId: string, data: Record<string, any>): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      toast({
        title: "Workflow Not Found",
        description: `Workflow ${workflowId} does not exist`,
        variant: "destructive",
      });
      return false;
    }

    if (!workflow.isActive) {
      toast({
        title: "Workflow Inactive",
        description: `Workflow ${workflow.name} is currently disabled`,
        variant: "destructive",
      });
      return false;
    }

    const payload: N8NWebhookPayload = {
      timestamp: new Date().toISOString(),
      source: 'crypto-trading-platform',
      data,
      workflow_id: workflowId
    };

    try {
      console.log(`Triggering N8N workflow: ${workflow.name}`, payload);

      const response = await fetch(workflow.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      toast({
        title: "Workflow Triggered",
        description: `${workflow.name} workflow has been executed`,
      });

      return true;
    } catch (error) {
      console.error(`Failed to trigger workflow ${workflowId}:`, error);
      toast({
        title: "Workflow Failed",
        description: `Failed to execute ${workflow.name} workflow`,
        variant: "destructive",
      });
      return false;
    }
  }

  async setupTradingAlerts(alertConfig: {
    symbol: string;
    priceThreshold: number;
    volumeThreshold: number;
    indicators: string[];
  }): Promise<boolean> {
    return this.triggerWorkflow('trading-alerts', {
      action: 'setup_alerts',
      config: alertConfig
    });
  }

  async triggerPortfolioRebalance(portfolioData: {
    currentAllocation: Record<string, number>;
    targetAllocation: Record<string, number>;
    rebalanceThreshold: number;
  }): Promise<boolean> {
    return this.triggerWorkflow('portfolio-rebalance', {
      action: 'rebalance',
      portfolio: portfolioData
    });
  }

  async analyzeNewsSentiment(newsItems: Array<{
    title: string;
    content: string;
    source: string;
    timestamp: string;
  }>): Promise<boolean> {
    return this.triggerWorkflow('news-sentiment', {
      action: 'analyze_news',
      news_items: newsItems
    });
  }

  async checkRiskLevels(riskData: {
    portfolioValue: number;
    drawdown: number;
    volatility: number;
    correlations: Record<string, number>;
  }): Promise<boolean> {
    return this.triggerWorkflow('risk-management', {
      action: 'assess_risk',
      risk_data: riskData
    });
  }

  async processSocialSentiment(socialData: {
    platform: string;
    mentions: number;
    sentiment_score: number;
    keywords: string[];
  }): Promise<boolean> {
    return this.triggerWorkflow('social-sentiment', {
      action: 'process_social_data',
      social_data: socialData
    });
  }

  getWorkflow(id: string): N8NWorkflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  updateWorkflow(id: string, updates: Partial<N8NWorkflow>): boolean {
    const workflow = this.workflows.get(id);
    if (workflow) {
      this.workflows.set(id, { ...workflow, ...updates });
      return true;
    }
    return false;
  }

  addCustomWorkflow(workflow: N8NWorkflow): void {
    this.workflows.set(workflow.id, workflow);
    toast({
      title: "Custom Workflow Added",
      description: `${workflow.name} has been added to your workflows`,
    });
  }
}

export const n8nService = new N8NService();
