
import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });
  
  it('opens the dropdown when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );
    
    // Click the toggle button
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Check if dropdown items are visible
    expect(screen.getByText(/Theme/i)).toBeInTheDocument();
    expect(screen.getByText(/Light/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark/i)).toBeInTheDocument();
    
    // Check if color scheme options are visible
    expect(screen.getByText(/Color Scheme/i)).toBeInTheDocument();
    expect(screen.getByText(/Default/i)).toBeInTheDocument();
    expect(screen.getByText(/Midnight Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/Cyber Pulse/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrix Code/i)).toBeInTheDocument();
  });
});
