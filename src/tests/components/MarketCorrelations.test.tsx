import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MarketCorrelations from '@/components/trading/MarketCorrelations';
import { fetchTopCoins } from '@/services/cryptoApi';

// Mock the API call
vi.mock('@/services/cryptoApi', () => ({
  fetchTopCoins: vi.fn().mockResolvedValue([
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 50000 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3000 }
  ])
}));

describe('MarketCorrelations', () => {
  it('renders without crashing', () => {
    render(<MarketCorrelations />);
    expect(screen.getByText(/Market Correlations/i)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
