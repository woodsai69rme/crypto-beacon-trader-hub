
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
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('calls onChange when a different currency is selected', () => {
    const handleChange = jest.fn();
    
    render(
      <TestWrapper>
        <CurrencySelector activeCurrency="USD" onCurrencyChange={handleChange} />
      </TestWrapper>
    );
    
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('AUD'));
    
    expect(handleChange).toHaveBeenCalledWith('AUD');
  });
});
