
export interface ContextData {
  id: string;
  type: 'market' | 'trading' | 'portfolio' | 'user' | 'system';
  category: string;
  data: any;
  timestamp: string;
  ttl?: number; // Time to live in milliseconds
  source: string;
  metadata?: Record<string, any>;
}

export interface ContextQuery {
  type?: string;
  category?: string;
  source?: string;
  keywords?: string[];
  timeRange?: {
    start: string;
    end: string;
  };
  limit?: number;
}

export interface ContextIndex {
  id: string;
  keywords: string[];
  type: string;
  category: string;
  timestamp: string;
  relevanceScore: number;
}

class ContextService {
  private contexts: Map<string, ContextData> = new Map();
  private index: Map<string, ContextIndex> = new Map();
  private subscribers: Map<string, ((context: ContextData) => void)[]> = new Map();

  constructor() {
    this.loadPersistedContexts();
    this.startCleanupTimer();
    console.log('Context service initialized');
  }

  // Store context data
  async storeContext(context: Omit<ContextData, 'id' | 'timestamp'>): Promise<string> {
    const id = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contextData: ContextData = {
      ...context,
      id,
      timestamp: new Date().toISOString(),
    };

    this.contexts.set(id, contextData);
    this.updateIndex(contextData);
    this.notifySubscribers(contextData);
    await this.persistContexts();

    console.log(`✅ Stored context: ${context.type}/${context.category}`);
    return id;
  }

  // Retrieve context by ID
  getContext(id: string): ContextData | null {
    return this.contexts.get(id) || null;
  }

  // Query contexts
  queryContexts(query: ContextQuery): ContextData[] {
    const results: ContextData[] = [];
    const now = Date.now();

    for (const context of this.contexts.values()) {
      // Check if context has expired
      if (context.ttl && now - new Date(context.timestamp).getTime() > context.ttl) {
        continue;
      }

      // Apply filters
      if (query.type && context.type !== query.type) continue;
      if (query.category && context.category !== query.category) continue;
      if (query.source && context.source !== query.source) continue;

      // Time range filter
      if (query.timeRange) {
        const contextTime = new Date(context.timestamp).getTime();
        const startTime = new Date(query.timeRange.start).getTime();
        const endTime = new Date(query.timeRange.end).getTime();
        
        if (contextTime < startTime || contextTime > endTime) continue;
      }

      // Keyword search
      if (query.keywords && query.keywords.length > 0) {
        const contextText = JSON.stringify(context.data).toLowerCase();
        const hasKeywords = query.keywords.some(keyword => 
          contextText.includes(keyword.toLowerCase())
        );
        if (!hasKeywords) continue;
      }

      results.push(context);
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    if (query.limit && results.length > query.limit) {
      return results.slice(0, query.limit);
    }

    return results;
  }

  // Subscribe to context updates
  subscribe(type: string, callback: (context: ContextData) => void): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(type);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Update existing context
  async updateContext(id: string, updates: Partial<ContextData>): Promise<boolean> {
    const context = this.contexts.get(id);
    if (!context) {
      return false;
    }

    const updatedContext = {
      ...context,
      ...updates,
      timestamp: new Date().toISOString(),
    };

    this.contexts.set(id, updatedContext);
    this.updateIndex(updatedContext);
    this.notifySubscribers(updatedContext);
    await this.persistContexts();

    return true;
  }

  // Delete context
  async deleteContext(id: string): Promise<boolean> {
    const deleted = this.contexts.delete(id);
    this.index.delete(id);
    
    if (deleted) {
      await this.persistContexts();
    }

    return deleted;
  }

  // Clear expired contexts
  async clearExpired(): Promise<number> {
    const now = Date.now();
    let cleared = 0;

    for (const [id, context] of this.contexts.entries()) {
      if (context.ttl && now - new Date(context.timestamp).getTime() > context.ttl) {
        this.contexts.delete(id);
        this.index.delete(id);
        cleared++;
      }
    }

    if (cleared > 0) {
      await this.persistContexts();
      console.log(`🧹 Cleared ${cleared} expired contexts`);
    }

    return cleared;
  }

  // Get context statistics
  getStats(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    bySource: Record<string, number>;
    oldestTimestamp: string;
    newestTimestamp: string;
  } {
    const stats = {
      total: this.contexts.size,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      oldestTimestamp: '',
      newestTimestamp: '',
    };

    let oldest = Date.now();
    let newest = 0;

    for (const context of this.contexts.values()) {
      // Count by type
      stats.byType[context.type] = (stats.byType[context.type] || 0) + 1;
      
      // Count by category
      stats.byCategory[context.category] = (stats.byCategory[context.category] || 0) + 1;
      
      // Count by source
      stats.bySource[context.source] = (stats.bySource[context.source] || 0) + 1;

      // Track timestamps
      const timestamp = new Date(context.timestamp).getTime();
      if (timestamp < oldest) oldest = timestamp;
      if (timestamp > newest) newest = timestamp;
    }

    stats.oldestTimestamp = new Date(oldest).toISOString();
    stats.newestTimestamp = new Date(newest).toISOString();

    return stats;
  }

  // Specialized methods for different context types

  // Market context
  async storeMarketContext(symbol: string, data: any, source: string = 'market-api'): Promise<string> {
    return this.storeContext({
      type: 'market',
      category: 'price-data',
      data: { symbol, ...data },
      source,
      ttl: 5 * 60 * 1000, // 5 minutes TTL for market data
    });
  }

  // Trading context
  async storeTradingSignal(signal: {
    symbol: string;
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
  }, source: string = 'ai-analysis'): Promise<string> {
    return this.storeContext({
      type: 'trading',
      category: 'signal',
      data: signal,
      source,
      ttl: 24 * 60 * 60 * 1000, // 24 hours TTL for trading signals
    });
  }

  // Portfolio context
  async storePortfolioSnapshot(portfolioData: any, source: string = 'portfolio-manager'): Promise<string> {
    return this.storeContext({
      type: 'portfolio',
      category: 'snapshot',
      data: portfolioData,
      source,
      ttl: 60 * 60 * 1000, // 1 hour TTL for portfolio snapshots
    });
  }

  // User context
  async storeUserAction(action: string, details: any, source: string = 'user-interface'): Promise<string> {
    return this.storeContext({
      type: 'user',
      category: 'action',
      data: { action, details },
      source,
    });
  }

  // System context
  async storeSystemEvent(event: string, details: any, source: string = 'system'): Promise<string> {
    return this.storeContext({
      type: 'system',
      category: 'event',
      data: { event, details },
      source,
    });
  }

  // Get recent contexts by type
  getRecentContexts(type: string, limit: number = 10): ContextData[] {
    return this.queryContexts({ type, limit });
  }

  // Get market context for symbol
  getMarketContext(symbol: string, limit: number = 5): ContextData[] {
    return this.queryContexts({
      type: 'market',
      keywords: [symbol],
      limit,
    });
  }

  // Get trading signals for symbol
  getTradingSignals(symbol: string, limit: number = 10): ContextData[] {
    return this.queryContexts({
      type: 'trading',
      category: 'signal',
      keywords: [symbol],
      limit,
    });
  }

  // Private methods

  private updateIndex(context: ContextData): void {
    const keywords = this.extractKeywords(context);
    const index: ContextIndex = {
      id: context.id,
      keywords,
      type: context.type,
      category: context.category,
      timestamp: context.timestamp,
      relevanceScore: this.calculateRelevanceScore(context),
    };

    this.index.set(context.id, index);
  }

  private extractKeywords(context: ContextData): string[] {
    const keywords: string[] = [];
    const text = JSON.stringify(context.data).toLowerCase();
    
    // Extract common crypto symbols
    const cryptoSymbols = ['btc', 'eth', 'sol', 'ada', 'dot', 'link', 'uni'];
    cryptoSymbols.forEach(symbol => {
      if (text.includes(symbol)) {
        keywords.push(symbol);
      }
    });

    // Extract trading terms
    const tradingTerms = ['buy', 'sell', 'hold', 'signal', 'analysis', 'trend', 'price'];
    tradingTerms.forEach(term => {
      if (text.includes(term)) {
        keywords.push(term);
      }
    });

    return keywords;
  }

  private calculateRelevanceScore(context: ContextData): number {
    const age = Date.now() - new Date(context.timestamp).getTime();
    const ageHours = age / (1000 * 60 * 60);
    
    // Score decreases with age
    const ageScore = Math.max(0, 100 - (ageHours * 2));
    
    // Boost score for certain types
    const typeBoosts = {
      trading: 20,
      market: 15,
      portfolio: 10,
      user: 5,
      system: 0,
    };
    
    return ageScore + (typeBoosts[context.type as keyof typeof typeBoosts] || 0);
  }

  private notifySubscribers(context: ContextData): void {
    const callbacks = this.subscribers.get(context.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(context);
        } catch (error) {
          console.error('Error in context subscriber:', error);
        }
      });
    }
  }

  private async persistContexts(): Promise<void> {
    try {
      const contextsArray = Array.from(this.contexts.values());
      localStorage.setItem('context_data', JSON.stringify(contextsArray));
    } catch (error) {
      console.error('Error persisting contexts:', error);
    }
  }

  private loadPersistedContexts(): void {
    try {
      const stored = localStorage.getItem('context_data');
      if (stored) {
        const contextsArray: ContextData[] = JSON.parse(stored);
        this.contexts.clear();
        
        contextsArray.forEach(context => {
          this.contexts.set(context.id, context);
          this.updateIndex(context);
        });

        console.log(`📥 Loaded ${contextsArray.length} persisted contexts`);
      }
    } catch (error) {
      console.error('Error loading persisted contexts:', error);
    }
  }

  private startCleanupTimer(): void {
    // Clean up expired contexts every 5 minutes
    setInterval(() => {
      this.clearExpired();
    }, 5 * 60 * 1000);
  }
}

export const contextService = new ContextService();
export default contextService;
