
import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ThemeToggle from '@/components/ThemeToggle';
import { TestWrapper } from '../utils/TestWrapper';

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );
    
    // Check if the button is rendered (now it's using ThemeSwitcher directly)
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });
});
