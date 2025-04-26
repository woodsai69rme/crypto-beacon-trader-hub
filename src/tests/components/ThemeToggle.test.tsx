
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import { TestWrapper } from '../utils/TestWrapper';

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );
    
    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });
  
  it('opens the dropdown when clicked', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );
    
    // Click the toggle button
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Check if dropdown items are visible
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });
});
