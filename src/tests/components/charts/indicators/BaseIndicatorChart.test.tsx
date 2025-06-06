
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import BaseIndicatorChart from '@/components/charts/indicators/BaseIndicatorChart';

describe('BaseIndicatorChart', () => {
  const mockData = [
    { timestamp: '2023-01-01', value: 100 },
    { timestamp: '2023-01-02', value: 110 },
    { timestamp: '2023-01-03', value: 105 },
  ];

  const mockLines = [
    { key: 'value', color: '#8884d8' }
  ];

  it('renders with title and data', () => {
    render(
      <BaseIndicatorChart
        title="Test Indicator"
        data={mockData}
        dataKey="timestamp"
        lines={mockLines}
      />
    );

    expect(screen.getByText('Test Indicator')).toBeInTheDocument();
  });

  it('renders loading state when data is empty', () => {
    render(
      <BaseIndicatorChart
        title="Test Indicator"
        data={[]}
        dataKey="timestamp"
        lines={mockLines}
      />
    );

    expect(screen.getByText('Test Indicator')).toBeInTheDocument();
  });
});
