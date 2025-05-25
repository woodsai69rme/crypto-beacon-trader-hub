
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MarketCorrelations from '@/components/MarketCorrelations';
import { CoinOption } from '@/types/trading';

// Mock the API call with a proper mock function
const mockFetchTopCoins = vi.fn().mockResolvedValue([
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 50000,
    priceChange: 1000,
    changePercent: 2,
    marketCap: 1000000000000,
    image: "https://example.com/btc.png",
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3000,
    priceChange: 100,
    changePercent: 3.3,
    marketCap: 350000000000,
    image: "https://example.com/eth.png",
    value: "ethereum",
    label: "Ethereum (ETH)"
  }
] as CoinOption[]);

vi.mock('@/services/cryptoApi', () => ({
  fetchTopCoins: mockFetchTopCoins
}));

// Mock the toast component
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

describe('MarketCorrelations', () => {
  it('renders without crashing', () => {
    render(<MarketCorrelations />);
    expect(screen.getByText(/Market Correlations/i)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
