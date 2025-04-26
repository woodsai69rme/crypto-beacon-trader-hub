
import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import { TestWrapper } from '../utils/TestWrapper';

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );
    
    // Check if the button is rendered (now it's using ThemeSwitcher inside)
    const button = screen.getByRole('button', { name: /change theme/i });
    expect(button).toBeInTheDocument();
  });
});
