
import { toast } from "@/hooks/use-toast";
import openRouterService from "../openRouterService";

interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  config: Record<string, any>;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
}

interface AutomationRule {
  id: string;
  name: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  isActive: boolean;
}

interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  source: string;
}

class N8NAutomationService {
  private workflows: Map<string, N8NWorkflow> = new Map();
  private automationRules: Map<string, AutomationRule> = new Map();
  private baseUrl = 'https://n8n.lovable.app'; // Configure your N8N instance
  private executionHistory: Array<{
    workflowId: string;
    timestamp: string;
    success: boolean;
    data: any;
  }> = [];

  constructor() {
    this.initializeWorkflows();
    this.initializeAutomationRules();
  }

  private initializeWorkflows() {
    const workflows: N8NWorkflow[] = [
      {
        id: 'trading-signal-processor',
        name: 'AI Trading Signal Processor',
        description: 'Processes AI-generated trading signals and executes trades',
        webhookUrl: `${this.baseUrl}/webhook/trading-signals`,
        isActive: true,
        triggers: ['ai_signal_generated', 'price_threshold_hit', 'technical_indicator_signal'],
        actions: ['validate_signal', 'calculate_position_size', 'execute_trade', 'send_notification'],
        config: {
          maxPositionSize: 0.1,
          riskPerTrade: 0.02,
          stopLossPercent: 0.05,
          takeProfitPercent: 0.15
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'portfolio-rebalancer',
        name: 'Automated Portfolio Rebalancer',
        description: 'Rebalances portfolio based on target allocations and market conditions',
        webhookUrl: `${this.baseUrl}/webhook/portfolio-rebalance`,
        isActive: true,
        triggers: ['scheduled_daily', 'deviation_threshold_exceeded', 'market_regime_change'],
        actions: ['analyze_portfolio', 'calculate_rebalance', 'execute_rebalance_trades', 'update_allocations'],
        config: {
          rebalanceThreshold: 0.05,
          minTradeSize: 50, // AUD
          maxSlippage: 0.01,
          excludeAssets: []
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'sentiment-analyzer',
        name: 'Market Sentiment Analyzer',
        description: 'Analyzes news, social media, and market sentiment for trading insights',
        webhookUrl: `${this.baseUrl}/webhook/sentiment-analysis`,
        isActive: true,
        triggers: ['news_article_published', 'social_mention_threshold', 'sentiment_shift_detected'],
        actions: ['fetch_news', 'analyze_sentiment', 'generate_sentiment_score', 'trigger_trades'],
        config: {
          sentimentSources: ['twitter', 'reddit', 'news', 'telegram'],
          sentimentThreshold: 0.7,
          analysisInterval: 300, // seconds
          keywordFilters: ['bitcoin', 'ethereum', 'crypto', 'blockchain']
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'risk-manager',
        name: 'Dynamic Risk Management',
        description: 'Monitors portfolio risk and implements protective measures',
        webhookUrl: `${this.baseUrl}/webhook/risk-management`,
        isActive: true,
        triggers: ['drawdown_threshold', 'volatility_spike', 'correlation_change', 'var_exceeded'],
        actions: ['calculate_var', 'adjust_position_sizes', 'implement_hedging', 'send_risk_alerts'],
        config: {
          maxDrawdown: 0.15,
          varConfidence: 0.95,
          volatilityThreshold: 0.5,
          correlationThreshold: 0.8,
          hedgingAssets: ['BTC', 'ETH']
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'arbitrage-scanner',
        name: 'Cross-Exchange Arbitrage Scanner',
        description: 'Scans for arbitrage opportunities across multiple exchanges',
        webhookUrl: `${this.baseUrl}/webhook/arbitrage-scanner`,
        isActive: true,
        triggers: ['price_discrepancy_detected', 'scheduled_scan'],
        actions: ['scan_exchanges', 'calculate_profit', 'execute_arbitrage', 'monitor_execution'],
        config: {
          minProfitThreshold: 0.005,
          maxExecutionTime: 30, // seconds
          supportedExchanges: ['binance', 'coinbase', 'kraken'],
          excludePairs: []
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'dca-bot',
        name: 'Dollar Cost Averaging Bot',
        description: 'Executes regular DCA purchases based on schedule and conditions',
        webhookUrl: `${this.baseUrl}/webhook/dca-bot`,
        isActive: true,
        triggers: ['scheduled_purchase', 'price_dip_detected', 'volatility_low'],
        actions: ['check_conditions', 'calculate_purchase_amount', 'execute_purchase', 'update_schedule'],
        config: {
          schedule: 'weekly',
          baseAmount: 100, // AUD
          volatilityBonus: 0.5,
          maxPurchaseAmount: 500,
          assets: ['BTC', 'ETH']
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'news-trader',
        name: 'News-Based Trading Bot',
        description: 'Executes trades based on news events and sentiment analysis',
        webhookUrl: `${this.baseUrl}/webhook/news-trader`,
        isActive: true,
        triggers: ['breaking_news', 'earnings_report', 'regulatory_news', 'partnership_announcement'],
        actions: ['analyze_news_impact', 'calculate_sentiment', 'generate_trade_signal', 'execute_news_trade'],
        config: {
          newsRelevanceThreshold: 0.8,
          sentimentConfidenceThreshold: 0.75,
          maxNewsTradeSize: 0.05,
          newsDecayTime: 3600 // seconds
        },
        executionCount: 0,
        successRate: 0
      },
      {
        id: 'yield-optimizer',
        name: 'DeFi Yield Optimizer',
        description: 'Optimizes yield farming and staking positions across DeFi protocols',
        webhookUrl: `${this.baseUrl}/webhook/yield-optimizer`,
        isActive: true,
        triggers: ['yield_opportunity_detected', 'position_maturity', 'apr_change'],
        actions: ['scan_yield_opportunities', 'calculate_optimal_allocation', 'execute_yield_strategy', 'compound_rewards'],
        config: {
          minAPR: 0.05,
          maxRiskScore: 0.7,
          compoundThreshold: 50, // AUD
          supportedProtocols: ['aave', 'compound', 'yearn', 'curve']
        },
        executionCount: 0,
        successRate: 0
      }
    ];

    workflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  private initializeAutomationRules() {
    const rules: AutomationRule[] = [
      {
        id: 'high-confidence-ai-signal',
        name: 'High Confidence AI Signal Auto-Trade',
        conditions: [
          { field: 'ai_signal_confidence', operator: '>=', value: 0.85 },
          { field: 'market_volatility', operator: '<=', value: 0.3 },
          { field: 'portfolio_exposure', operator: '<=', value: 0.8 }
        ],
        actions: [
          {
            type: 'execute_trade',
            config: {
              maxPositionSize: 0.05,
              useStopLoss: true,
              useTakeProfit: true
            }
          }
        ],
        isActive: true
      },
      {
        id: 'portfolio-deviation-rebalance',
        name: 'Portfolio Deviation Auto-Rebalance',
        conditions: [
          { field: 'allocation_deviation', operator: '>=', value: 0.1 },
          { field: 'time_since_last_rebalance', operator: '>=', value: 86400 }
        ],
        actions: [
          {
            type: 'rebalance_portfolio',
            config: {
              maxTradeSize: 0.2,
              minTradeSize: 0.01
            }
          }
        ],
        isActive: true
      },
      {
        id: 'risk-management-stop',
        name: 'Emergency Risk Management',
        conditions: [
          { field: 'portfolio_drawdown', operator: '>=', value: 0.15 },
          { field: 'var_exceeded', operator: '==', value: true }
        ],
        actions: [
          {
            type: 'reduce_exposure',
            config: {
              reductionPercent: 0.3,
              hedgePositions: true
            }
          },
          {
            type: 'send_alert',
            config: {
              channels: ['email', 'sms', 'discord'],
              priority: 'high'
            }
          }
        ],
        isActive: true
      }
    ];

    rules.forEach(rule => {
      this.automationRules.set(rule.id, rule);
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

    const payload = {
      timestamp: new Date().toISOString(),
      source: 'crypto-trading-platform',
      workflowId,
      data,
      config: workflow.config
    };

    try {
      console.log(`Triggering N8N workflow: ${workflow.name}`, payload);

      const response = await fetch(workflow.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workflow-ID': workflowId,
          'X-Platform': 'crypto-trading-platform'
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // Update execution statistics
      workflow.executionCount++;
      workflow.lastExecuted = new Date().toISOString();
      
      // Log execution
      this.executionHistory.push({
        workflowId,
        timestamp: new Date().toISOString(),
        success: true,
        data: payload
      });

      toast({
        title: "Workflow Triggered",
        description: `${workflow.name} workflow has been executed`,
      });

      return true;
    } catch (error) {
      console.error(`Failed to trigger workflow ${workflowId}:`, error);
      
      // Log failed execution
      this.executionHistory.push({
        workflowId,
        timestamp: new Date().toISOString(),
        success: false,
        data: { error: error.message, payload }
      });

      toast({
        title: "Workflow Failed",
        description: `Failed to execute ${workflow.name} workflow`,
        variant: "destructive",
      });
      return false;
    }
  }

  async processAITradingSignal(signal: TradingSignal): Promise<boolean> {
    // Enhanced AI signal processing with multiple validation steps
    const validatedSignal = await this.validateTradingSignal(signal);
    
    if (!validatedSignal.isValid) {
      console.log('Trading signal validation failed:', validatedSignal.reason);
      return false;
    }

    // Check automation rules
    const applicableRules = this.getApplicableRules({
      ai_signal_confidence: signal.confidence,
      signal_type: signal.signal,
      symbol: signal.symbol
    });

    if (applicableRules.length === 0) {
      console.log('No automation rules matched for signal');
      return false;
    }

    // Execute applicable automation actions
    for (const rule of applicableRules) {
      for (const action of rule.actions) {
        await this.executeAutomationAction(action, signal);
      }
    }

    return this.triggerWorkflow('trading-signal-processor', {
      signal,
      validatedSignal,
      automationActions: applicableRules.map(r => r.name)
    });
  }

  private async validateTradingSignal(signal: TradingSignal): Promise<{
    isValid: boolean;
    reason?: string;
    adjustedConfidence?: number;
  }> {
    // Multi-factor signal validation
    const validations = [
      this.validateSignalConfidence(signal),
      this.validateMarketConditions(signal),
      this.validatePortfolioRisk(signal),
      await this.validateWithAI(signal)
    ];

    const failedValidations = validations.filter(v => !v.isValid);
    
    if (failedValidations.length > 0) {
      return {
        isValid: false,
        reason: failedValidations.map(v => v.reason).join(', ')
      };
    }

    // Calculate adjusted confidence based on validation results
    const avgConfidence = validations.reduce((sum, v) => sum + (v.confidence || 0), 0) / validations.length;
    
    return {
      isValid: true,
      adjustedConfidence: Math.min(signal.confidence, avgConfidence)
    };
  }

  private validateSignalConfidence(signal: TradingSignal): { isValid: boolean; reason?: string; confidence: number } {
    if (signal.confidence < 0.6) {
      return {
        isValid: false,
        reason: 'Signal confidence below minimum threshold',
        confidence: signal.confidence
      };
    }
    return { isValid: true, confidence: signal.confidence };
  }

  private validateMarketConditions(signal: TradingSignal): { isValid: boolean; reason?: string; confidence: number } {
    // Mock market condition validation
    const volatility = Math.random() * 0.5; // Mock volatility
    const liquidity = Math.random(); // Mock liquidity
    
    if (volatility > 0.4) {
      return {
        isValid: false,
        reason: 'Market volatility too high',
        confidence: 0.3
      };
    }
    
    if (liquidity < 0.3) {
      return {
        isValid: false,
        reason: 'Insufficient market liquidity',
        confidence: 0.4
      };
    }
    
    return { isValid: true, confidence: 0.8 };
  }

  private validatePortfolioRisk(signal: TradingSignal): { isValid: boolean; reason?: string; confidence: number } {
    // Mock portfolio risk validation
    const currentExposure = Math.random(); // Mock current exposure
    const correlationRisk = Math.random(); // Mock correlation risk
    
    if (currentExposure > 0.8) {
      return {
        isValid: false,
        reason: 'Portfolio exposure too high',
        confidence: 0.2
      };
    }
    
    if (correlationRisk > 0.7) {
      return {
        isValid: false,
        reason: 'High correlation risk detected',
        confidence: 0.4
      };
    }
    
    return { isValid: true, confidence: 0.9 };
  }

  private async validateWithAI(signal: TradingSignal): Promise<{ isValid: boolean; reason?: string; confidence: number }> {
    try {
      const aiValidation = await openRouterService.generateTradingSignal(
        {
          signal: signal,
          marketContext: 'validation_request',
          baseCurrency: 'AUD'
        },
        'signal_validation',
        'deepseek/deepseek-r1'
      );
      
      return {
        isValid: aiValidation.confidence > 0.7,
        reason: aiValidation.confidence <= 0.7 ? 'AI validation failed' : undefined,
        confidence: aiValidation.confidence
      };
    } catch (error) {
      console.error('AI validation failed:', error);
      return {
        isValid: true, // Fail open
        confidence: 0.5
      };
    }
  }

  private getApplicableRules(context: Record<string, any>): AutomationRule[] {
    return Array.from(this.automationRules.values()).filter(rule => {
      if (!rule.isActive) return false;
      
      return rule.conditions.every(condition => {
        const value = context[condition.field];
        switch (condition.operator) {
          case '>=': return value >= condition.value;
          case '<=': return value <= condition.value;
          case '==': return value === condition.value;
          case '!=': return value !== condition.value;
          case '>': return value > condition.value;
          case '<': return value < condition.value;
          default: return false;
        }
      });
    });
  }

  private async executeAutomationAction(action: { type: string; config: Record<string, any> }, context: any): Promise<void> {
    console.log(`Executing automation action: ${action.type}`, action.config);
    
    switch (action.type) {
      case 'execute_trade':
        await this.triggerWorkflow('trading-signal-processor', {
          action: 'execute_trade',
          config: action.config,
          context
        });
        break;
        
      case 'rebalance_portfolio':
        await this.triggerWorkflow('portfolio-rebalancer', {
          action: 'rebalance',
          config: action.config,
          context
        });
        break;
        
      case 'send_alert':
        await this.sendAlert(action.config, context);
        break;
        
      case 'reduce_exposure':
        await this.triggerWorkflow('risk-manager', {
          action: 'reduce_exposure',
          config: action.config,
          context
        });
        break;
        
      default:
        console.warn(`Unknown automation action type: ${action.type}`);
    }
  }

  private async sendAlert(config: Record<string, any>, context: any): Promise<void> {
    const alertData = {
      timestamp: new Date().toISOString(),
      priority: config.priority || 'medium',
      channels: config.channels || ['app'],
      message: `Automation alert triggered: ${JSON.stringify(context)}`,
      context
    };
    
    console.log('Sending alert:', alertData);
    
    toast({
      title: "Automation Alert",
      description: alertData.message,
      variant: config.priority === 'high' ? 'destructive' : 'default',
    });
  }

  // Convenience methods for common workflows
  async setupDCAStrategy(config: {
    assets: string[];
    amount: number;
    frequency: string;
    conditions?: Record<string, any>;
  }): Promise<boolean> {
    return this.triggerWorkflow('dca-bot', {
      action: 'setup_dca',
      config
    });
  }

  async optimizeYieldFarming(config: {
    protocols: string[];
    minAPR: number;
    maxRisk: number;
    allocation: Record<string, number>;
  }): Promise<boolean> {
    return this.triggerWorkflow('yield-optimizer', {
      action: 'optimize_yield',
      config
    });
  }

  async scanArbitrageOpportunities(config: {
    exchanges: string[];
    minProfit: number;
    assets?: string[];
  }): Promise<boolean> {
    return this.triggerWorkflow('arbitrage-scanner', {
      action: 'scan_arbitrage',
      config
    });
  }

  async analyzeMarketSentiment(config: {
    sources: string[];
    assets: string[];
    timeframe: string;
  }): Promise<boolean> {
    return this.triggerWorkflow('sentiment-analyzer', {
      action: 'analyze_sentiment',
      config
    });
  }

  // Management methods
  getWorkflow(id: string): N8NWorkflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows(): N8NWorkflow[] {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  updateWorkflowConfig(id: string, config: Record<string, any>): boolean {
    const workflow = this.workflows.get(id);
    if (workflow) {
      workflow.config = { ...workflow.config, ...config };
      return true;
    }
    return false;
  }

  toggleWorkflow(id: string): boolean {
    const workflow = this.workflows.get(id);
    if (workflow) {
      workflow.isActive = !workflow.isActive;
      return true;
    }
    return false;
  }

  getExecutionHistory(workflowId?: string): Array<any> {
    if (workflowId) {
      return this.executionHistory.filter(h => h.workflowId === workflowId);
    }
    return this.executionHistory;
  }

  getWorkflowStatistics(workflowId: string): {
    executionCount: number;
    successRate: number;
    lastExecuted?: string;
    avgExecutionTime?: number;
  } | null {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    const history = this.getExecutionHistory(workflowId);
    const successCount = history.filter(h => h.success).length;
    
    return {
      executionCount: workflow.executionCount,
      successRate: workflow.executionCount > 0 ? successCount / workflow.executionCount : 0,
      lastExecuted: workflow.lastExecuted
    };
  }
}

export const n8nAutomationService = new N8NAutomationService();
export default n8nAutomationService;
