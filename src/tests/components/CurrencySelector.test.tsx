
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CurrencySelector from '@/components/trading/CurrencySelector';

// Update the CurrencySelectorProps interface to include the disabled property
interface CurrencySelectorProps {
  activeCurrency: string;
  onCurrencyChange: (currency: string) => void;
  disabled?: boolean;
}

describe('CurrencySelector', () => {
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    mockOnChange.mockReset();
  });
  
  it('renders correctly with default props', () => {
    render(<CurrencySelector activeCurrency="AUD" onCurrencyChange={mockOnChange} />);
    
    expect(screen.getByText(/AUD/i)).toBeInTheDocument();
  });
  
  it('shows dropdown when clicked', async () => {
    render(<CurrencySelector activeCurrency="AUD" onCurrencyChange={mockOnChange} />);
    
    const selector = screen.getByRole('button');
    fireEvent.click(selector);
    
    // Check for common currencies in the dropdown
    expect(await screen.findByText(/USD/i)).toBeInTheDocument();
  });
  
  it('calls onChange when a currency is selected', async () => {
    render(<CurrencySelector activeCurrency="AUD" onCurrencyChange={mockOnChange} />);
    
    const selector = screen.getByRole('button');
    fireEvent.click(selector);
    
    const usdOption = await screen.findByText(/USD/i);
    fireEvent.click(usdOption);
    
    expect(mockOnChange).toHaveBeenCalledWith('USD');
  });
  
  it('respects the disabled prop', () => {
    render(<CurrencySelector activeCurrency="USD" onCurrencyChange={mockOnChange} disabled={true} />);
    
    const selector = screen.getByRole('button');
    expect(selector).toBeDisabled();
  });
});
