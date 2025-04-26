
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '@/components/settings/ThemeSwitcher';
import { TestWrapper } from '../utils/TestWrapper';

describe('ThemeSwitcher', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );
    
    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /change theme/i });
    expect(button).toBeInTheDocument();
  });
  
  it('opens the dropdown when clicked', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );
    
    // Click the toggle button
    const button = screen.getByRole('button', { name: /change theme/i });
    fireEvent.click(button);
    
    // Check if dropdown items are visible
    expect(screen.getByText(/Theme Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Light/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark/i)).toBeInTheDocument();
    
    // Check if color scheme options are visible
    expect(screen.getByText(/Color Scheme/i)).toBeInTheDocument();
    expect(screen.getByText(/Default/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue/i)).toBeInTheDocument();
    expect(screen.getByText(/Purple/i)).toBeInTheDocument();
  });
});
