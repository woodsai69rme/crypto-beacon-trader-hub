import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EnhancedCryptoChart from '@/components/EnhancedCryptoChart';
import { getCoinHistory } from '@/services/cryptoApi';

// Mock the API
vi.mock('@/services/cryptoApi', () => ({
  getCoinHistory: vi.fn()
}));

describe('EnhancedCryptoChart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementation
    (getCoinHistory as jest.Mock).mockResolvedValue({
      prices: [[1609459200000, 29000], [1609545600000, 29500]]
    });
  });
  
  it('renders loading state initially', () => {
    render(
      <EnhancedCryptoChart 
        coin="Bitcoin" 
        coinId="bitcoin" 
        color="#F7931A" 
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('renders error state when API fails', async () => {
    (getCoinHistory as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(
      <EnhancedCryptoChart 
        coin="Bitcoin" 
        coinId="bitcoin"
        color="#F7931A"
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  
  it('renders chart when data loads successfully', async () => {
    render(
      <EnhancedCryptoChart 
        coin="Bitcoin" 
        coinId="bitcoin"
        color="#F7931A"
      />
    );
    
    await waitFor(() => {
      expect(getCoinHistory).toHaveBeenCalledWith('bitcoin', expect.anything());
      // Verify chart renders (this will depend on your chart implementation)
      // e.g., expect(screen.getByTestId('crypto-chart')).toBeInTheDocument();
    });
  });
  
  it('handles timeframe changes', async () => {
    render(
      <EnhancedCryptoChart 
        coin="Bitcoin" 
        coinId="bitcoin"
        color="#F7931A"
      />
    );
    
    await waitFor(() => {
      expect(getCoinHistory).toHaveBeenCalledWith('bitcoin', expect.anything());
    });
    
    // Test timeframe change if applicable
  });
});
