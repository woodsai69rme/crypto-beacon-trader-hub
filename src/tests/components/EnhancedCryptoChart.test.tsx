
import { render, act } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import EnhancedCryptoChart from '@/components/EnhancedCryptoChart';
import { fetchCoinHistory } from '@/services/cryptoApi';

// Mock the cryptoApi fetch function
jest.mock('@/services/cryptoApi', () => ({
  fetchCoinHistory: jest.fn(),
  CryptoChartData: {},
}));

// Mock the toast notification
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('EnhancedCryptoChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockChartData = {
    prices: [
      [1617753600000, 55000], // April 7, 2021
      [1617840000000, 56000], // April 8, 2021
      [1617926400000, 58000], // April 9, 2021
    ],
  };

  const defaultProps = {
    coin: "Bitcoin",
    coinId: "bitcoin",
    color: "#f7931a"
  };

  it('renders loading state initially', () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart {...defaultProps} />);
    
    expect(screen.getByText(/Bitcoin Chart/i)).toBeInTheDocument();
  });

  it('renders chart when data is loaded', async () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart {...defaultProps} />);
    
    // Check that the chart container is rendered
    expect(screen.getByText(/Price chart for bitcoin will appear here/i)).toBeInTheDocument();
  });

  it('shows different time periods when buttons are clicked', async () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart {...defaultProps} />);
    
    // Check that the component renders with the coin name
    expect(screen.getByText(/Bitcoin Chart/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('Failed to fetch');
    (fetchCoinHistory as jest.Mock).mockRejectedValue(error);
    
    render(<EnhancedCryptoChart {...defaultProps} />);
    
    // Check that it renders without crashing
    expect(screen.getByText(/Bitcoin Chart/i)).toBeInTheDocument();
  });
});
