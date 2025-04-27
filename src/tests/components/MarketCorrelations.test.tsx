
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MarketCorrelations from '@/components/MarketCorrelations/MarketCorrelations';
import { fetchTopCoins } from '@/services/cryptoApi';

// Mock the API call
vi.mock('@/services/cryptoApi', () => ({
  fetchTopCoins: vi.fn().mockResolvedValue([
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 50000, current_price: 50000, market_cap: 1000000000000, market_cap_rank: 1 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3000, current_price: 3000, market_cap: 350000000000, market_cap_rank: 2 }
  ])
}));

describe('MarketCorrelations', () => {
  it('renders without crashing', () => {
    render(<MarketCorrelations />);
    expect(screen.getByText(/Market Correlations/i)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
