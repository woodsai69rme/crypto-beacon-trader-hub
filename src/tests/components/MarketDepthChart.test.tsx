
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketDepthChart from '@/components/MarketDepthChart';

describe('MarketDepthChart', () => {
  it('renders with default props', () => {
    render(<MarketDepthChart coinId="bitcoin" symbol="BTC" />);
    
    expect(screen.getByText('Market Depth')).toBeInTheDocument();
    expect(screen.getByText(/Order book visualization for BTC/i)).toBeInTheDocument();
    
    // Check that the exchange dropdown is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Binance')).toBeInTheDocument();
    
    // Check that the chart is rendered
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('allows changing exchanges', async () => {
    render(<MarketDepthChart coinId="bitcoin" symbol="BTC" />);
    
    // Open the dropdown
    const dropdown = screen.getByRole('combobox');
    await userEvent.click(dropdown);
    
    // Select another exchange
    const coinbaseOption = screen.getByText('Coinbase');
    await userEvent.click(coinbaseOption);
    
    // Check that the exchange has been updated
    expect(screen.getByText('Coinbase')).toBeInTheDocument();
  });

  it('renders bid and ask indicators in the legend', () => {
    render(<MarketDepthChart coinId="bitcoin" symbol="BTC" />);
    
    expect(screen.getByText('Bids (Buy Orders)')).toBeInTheDocument();
    expect(screen.getByText('Asks (Sell Orders)')).toBeInTheDocument();
  });
});
