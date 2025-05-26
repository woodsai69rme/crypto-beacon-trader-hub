
import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
  
  it('calls onChange when a different currency is selected', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <CurrencySelector activeCurrency="USD" onCurrencyChange={handleChange} />
      </TestWrapper>
    );
    
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('AUD'));
    
    expect(handleChange).toHaveBeenCalledWith('AUD');
  });
});
