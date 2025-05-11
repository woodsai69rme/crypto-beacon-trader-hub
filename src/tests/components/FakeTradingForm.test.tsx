
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import FakeTradingForm from '@/components/trading/FakeTradingForm';
import { toast } from '@/components/ui/use-toast';

// Mock the toast component
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

describe('FakeTradingForm', () => {
  const mockOnAddTrade = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with all form elements', () => {
    render(<FakeTradingForm onAddTrade={mockOnAddTrade} />);
    
    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Trade Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sell/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add trade/i })).toBeInTheDocument();
  });

  it('shows advanced settings when advancedMode is true', () => {
    render(<FakeTradingForm onAddTrade={mockOnAddTrade} advancedMode={true} />);
    
    expect(screen.getByText('Advanced Settings')).toBeInTheDocument();
    expect(screen.getByText('Fee (%)')).toBeInTheDocument();
    expect(screen.getByText('Slippage (%)')).toBeInTheDocument();
  });

  it('displays error toast when form is submitted with missing fields', async () => {
    render(<FakeTradingForm onAddTrade={mockOnAddTrade} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add trade/i }));
    
    expect(toast).toHaveBeenCalledWith({
      title: "Missing Fields",
      description: "Please fill in all required fields",
      variant: "destructive"
    });
    expect(mockOnAddTrade).not.toHaveBeenCalled();
  });

  it('calls onAddTrade with correct data when form is fully filled and submitted', async () => {
    const user = userEvent.setup();
    render(<FakeTradingForm onAddTrade={mockOnAddTrade} />);
    
    // Fill out the form
    // Open select dropdown and choose Bitcoin
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Bitcoin (BTC)'));
    
    // Fill price
    await user.type(screen.getByLabelText('Price'), '50000');
    
    // Fill quantity
    await user.type(screen.getByLabelText('Quantity'), '0.5');
    
    // Set date
    await user.type(screen.getByLabelText('Trade Date'), '2023-01-01');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /add trade/i }));
    
    expect(mockOnAddTrade).toHaveBeenCalledTimes(1);
    const calledWith = mockOnAddTrade.mock.calls[0][0];
    
    expect(calledWith.coinId).toBe('BTC');
    expect(calledWith.type).toBe('buy');
    expect(calledWith.amount).toBe(0.5);
    expect(calledWith.price).toBe(50000);
    expect(calledWith.total).toBe(25000);
    
    expect(toast).toHaveBeenCalledWith({
      title: "Trade Added",
      description: expect.any(String)
    });
  });

  it('switches between buy and sell modes', async () => {
    const user = userEvent.setup();
    render(<FakeTradingForm onAddTrade={mockOnAddTrade} />);
    
    // Default should be buy
    const buyButton = screen.getByRole('button', { name: /buy/i });
    const sellButton = screen.getByRole('button', { name: /sell/i });
    
    expect(buyButton).toHaveClass('bg-green-500');
    expect(sellButton).not.toHaveClass('bg-red-500');
    
    // Switch to sell
    await user.click(sellButton);
    
    expect(buyButton).not.toHaveClass('bg-green-500');
    expect(sellButton).toHaveClass('bg-red-500');
  });
});
