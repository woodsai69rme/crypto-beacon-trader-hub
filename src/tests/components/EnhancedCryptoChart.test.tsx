
import { render, screen, act, waitFor } from '@testing-library/react';
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

  it('renders loading state initially', () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart coin="Bitcoin" />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders chart when data is loaded', async () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart coin="Bitcoin" />);
    
    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Check that the chart container is rendered
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('shows different time periods when buttons are clicked', async () => {
    (fetchCoinHistory as jest.Mock).mockResolvedValue(mockChartData);
    
    render(<EnhancedCryptoChart coin="Bitcoin" />);
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(fetchCoinHistory).toHaveBeenCalledWith("bitcoin", 7); // Default is 7 days
    });
    
    // Click on 30D button
    const thirtyDayButton = screen.getByRole('button', { name: /30D/i });
    await act(async () => {
      userEvent.click(thirtyDayButton);
    });
    
    // Check that it fetched data with the new time period
    await waitFor(() => {
      expect(fetchCoinHistory).toHaveBeenCalledWith("bitcoin", 30);
    });
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('Failed to fetch');
    (fetchCoinHistory as jest.Mock).mockRejectedValue(error);
    
    render(<EnhancedCryptoChart coin="Bitcoin" />);
    
    // Check that it falls back to mock data and doesn't crash
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });
  });
});
