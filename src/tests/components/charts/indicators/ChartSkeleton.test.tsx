
import React from 'react';
import { render } from '@testing-library/react';
import ChartSkeleton from '@/components/charts/indicators/ChartSkeleton';

// Mock the Skeleton component
jest.mock('@/components/ui/loading-skeleton', () => ({
  Skeleton: ({ height, width }: { height: number, width: string }) => (
    <div data-testid="skeleton" style={{ height, width }}></div>
  ),
}));

describe('ChartSkeleton', () => {
  it('renders with default height', () => {
    const { getByTestId } = render(<ChartSkeleton />);
    const skeleton = getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('height: 200px');
  });

  it('renders with custom height', () => {
    const { getByTestId } = render(<ChartSkeleton height={400} />);
    const skeleton = getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('height: 400px');
  });
});
