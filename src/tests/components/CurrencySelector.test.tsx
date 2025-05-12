
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CurrencySelector from '@/components/CurrencySelector';

describe('CurrencySelector component', () => {
  const mockOnChange = jest.fn();
  const currencies = ['USD', 'EUR', 'GBP', 'AUD'];
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  
  test('renders with default currency selected', () => {
    const { getByText } = render(
      <CurrencySelector 
        value="USD"
        onChange={mockOnChange}
        currencies={currencies}
      />
    );
    
    expect(getByText('USD')).toBeInTheDocument();
  });
  
  test('opens dropdown when clicked', () => {
    const { getByText, getByRole } = render(
      <CurrencySelector 
        value="USD"
        onChange={mockOnChange}
        currencies={currencies}
      />
    );
    
    // Open dropdown
    fireEvent.click(getByRole('combobox'));
    
    // Check if all currency options are visible
    expect(getByText('EUR')).toBeInTheDocument();
    expect(getByText('GBP')).toBeInTheDocument();
    expect(getByText('AUD')).toBeInTheDocument();
  });
  
  test('calls onChange when new currency is selected', () => {
    const { getByText, getByRole } = render(
      <CurrencySelector 
        value="USD"
        onChange={mockOnChange}
        currencies={currencies}
      />
    );
    
    // Open dropdown
    fireEvent.click(getByRole('combobox'));
    
    // Select a different currency
    fireEvent.click(getByText('EUR'));
    
    // Check if onChange was called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith('EUR');
  });
  
  test('handles empty currencies array', () => {
    render(
      <CurrencySelector 
        value="USD"
        onChange={mockOnChange}
        currencies={[]}
      />
    );
    
    expect(true).toBeTruthy(); // Just checking that it renders without error
  });
  
  test('shows only the allowed currencies', () => {
    const limitedCurrencies = ['USD', 'EUR'];
    
    const { getByText, getByRole, queryByText } = render(
      <CurrencySelector 
        value="USD"
        onChange={mockOnChange}
        currencies={limitedCurrencies}
      />
    );
    
    // Open dropdown
    fireEvent.click(getByRole('combobox'));
    
    // Check if only specified currencies are visible
    expect(getByText('EUR')).toBeInTheDocument();
    expect(queryByText('GBP')).not.toBeInTheDocument();
    expect(queryByText('AUD')).not.toBeInTheDocument();
  });
});
