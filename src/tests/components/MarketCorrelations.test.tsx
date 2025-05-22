
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import MarketCorrelations from '@/components/MarketCorrelations';
import { getTopCoins } from '@/services/cryptoApi';

// Mock the API
vi.mock('@/services/cryptoApi', () => ({
  getTopCoins: vi.fn()
}));

describe('MarketCorrelations', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock API response
    (getTopCoins as jest.Mock).mockResolvedValue([
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 3000 }
    ]);
  });
  
  it('renders correctly', async () => {
    render(<MarketCorrelations />);
    
    // Test loading state if applicable
    // await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    
    // Test that component renders with data
    // await waitFor(() => expect(screen.getByText(/correlation/i)).toBeInTheDocument());
  });
  
  // Add more tests as needed
});
