
import { render, screen } from '@testing-library/react';
import BaseIndicatorChart from '@/components/charts/indicators/BaseIndicatorChart';

describe('BaseIndicatorChart', () => {
  const mockData = [
    { date: '2023-01-01', value: 30 },
    { date: '2023-01-02', value: 35 },
    { date: '2023-01-03', value: 32 },
  ];

  it('renders without crashing', () => {
    render(
      <BaseIndicatorChart
        data={mockData}
        lines={[
          {
            key: 'value',
            color: '#4f46e5',
            dot: { r: 5 },
          },
        ]}
      />
    );
    // Verify that the chart container is in the document
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('renders with multiple lines', () => {
    const multiLineData = [
      { date: '2023-01-01', line1: 30, line2: 20 },
      { date: '2023-01-02', line1: 35, line2: 25 },
      { date: '2023-01-03', line1: 32, line2: 28 },
    ];

    render(
      <BaseIndicatorChart
        data={multiLineData}
        lines={[
          {
            key: 'line1',
            color: '#4f46e5',
            dot: { r: 5 },
          },
          {
            key: 'line2',
            color: '#ff0000',
            dot: false,
          },
        ]}
      />
    );

    // Should have two line elements
    const lineElements = document.querySelectorAll('.recharts-line');
    expect(lineElements).toHaveLength(2);
  });

  it('renders with reference lines', () => {
    render(
      <BaseIndicatorChart
        data={mockData}
        lines={[
          {
            key: 'value',
            color: '#4f46e5',
            dot: { r: 5 },
          },
        ]}
        referenceLines={[
          {
            y: 30,
            stroke: 'red',
            strokeDasharray: '3 3',
          },
        ]}
      />
    );

    // Should have a reference line
    const refLine = document.querySelector('.recharts-reference-line');
    expect(refLine).toBeInTheDocument();
  });
});
