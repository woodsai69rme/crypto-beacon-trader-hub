
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketCorrelations from '@/components/MarketCorrelations';
import { fetchTopCoins } from '@/services/cryptoApi';

// Mock the cryptoApi fetch functions
jest.mock('@/services/cryptoApi', () => ({
  fetchTopCoins: jest.fn(),
  CryptoData: {},
}));

// Mock the toast notification
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('MarketCorrelations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API response
    (fetchTopCoins as jest.Mock).mockResolvedValue([
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 50000 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3000 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 100 },
    ]);
  });

  it('renders loading state initially', () => {
    render(<MarketCorrelations />);
    
    expect(screen.getByText('Loading market data...')).toBeInTheDocument();
  });

  it('renders correlation matrix when data is loaded', async () => {
    render(<MarketCorrelations />);
    
    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading market data...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Correlation Matrix')).toBeInTheDocument();
  });

  it('allows switching between tabs', async () => {
    render(<MarketCorrelations />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading market data...')).not.toBeInTheDocument();
    });
    
    // Switch to Analysis tab
    const analysisTab = screen.getByRole('tab', { name: /Analysis/i });
    await userEvent.click(analysisTab);
    
    // Check that the analysis content is shown
    expect(screen.getByText('Selected Assets')).toBeInTheDocument();
  });

  it('allows selecting coins for correlation analysis', async () => {
    render(<MarketCorrelations />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading market data...')).not.toBeInTheDocument();
    });
    
    // Switch to Analysis tab
    const analysisTab = screen.getByRole('tab', { name: /Analysis/i });
    await userEvent.click(analysisTab);
    
    // Select Bitcoin
    const bitcoinButton = screen.getByRole('button', { name: 'BTC' });
    await userEvent.click(bitcoinButton);
    
    // Check that Bitcoin is selected
    expect(bitcoinButton).toHaveClass('text-primary-foreground');
  });
});
