
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exchangeService, supportedExchanges } from '@/services/api/exchangeIntegrations';

// Mock the toast function
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

describe('ExchangeIntegrationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Reset localStorage mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  it('should have Deribit in the supported exchanges list', () => {
    const exchanges = exchangeService.getAllExchanges();
    const deribit = exchanges.find(exchange => exchange.id === 'deribit');
    
    expect(deribit).toBeDefined();
    expect(deribit?.name).toBe('Deribit');
    expect(deribit?.website).toBe('https://deribit.com');
    expect(deribit?.supportedFeatures.futuresTrading).toBe(true);
    expect(deribit?.supportedFeatures.spotTrading).toBe(false);
  });

  it('should connect to Deribit exchange', async () => {
    const credentials = {
      apiKey: 'test-key',
      apiSecret: 'test-secret'
    };

    // Use the real connect method
    const result = await exchangeService.connectExchange('deribit', credentials);
    
    // Should return true on successful connection
    expect(result).toBe(true);
    
    // Exchange should be connected
    const deribit = exchangeService.getExchange('deribit');
    expect(deribit?.connectionStatus).toBe('connected');
    expect(deribit?.credentials?.apiKey).toBe('test-key');
    expect(deribit?.credentials?.apiSecret).toBe('••••••••');
  });
});
