
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencySelector from '@/components/trading/CurrencySelector';
import { TestWrapper } from '../utils/TestWrapper';

describe('CurrencySelector', () => {
  it('renders with the active currency', () => {
    const handleChange = jest.fn();
    
    render(
      <TestWrapper>
        <CurrencySelector activeCurrency="USD" onCurrencyChange={handleChange} />
      </TestWrapper>
    );
    
    // The trigger should show the selected currency
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('calls onChange when a different currency is selected', () => {
    const handleChange = jest.fn();
    
    render(
      <TestWrapper>
        <CurrencySelector activeCurrency="USD" onCurrencyChange={handleChange} />
      </TestWrapper>
    );
    
    // Open the dropdown
    fireEvent.click(screen.getByRole('combobox'));
    
    // Select AUD
    fireEvent.click(screen.getByText('AUD'));
    
    // Check if the change handler was called with the right argument
    expect(handleChange).toHaveBeenCalledWith('AUD');
  });
  
  it('disables the selector when disabled prop is true', () => {
    const handleChange = jest.fn();
    
    render(
      <TestWrapper>
        <CurrencySelector 
          activeCurrency="USD" 
          onCurrencyChange={handleChange} 
          disabled={true}
        />
      </TestWrapper>
    );
    
    // The trigger should be disabled
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
