export const generateRandomData = (count: number, startValue: number, variance: number): number[] => {
  const data: number[] = [];
  let currentValue = startValue;

  for (let i = 0; i < count; i++) {
    const change = Math.random() * variance - variance / 2;
    currentValue += change;
    data.push(currentValue);
  }

  return data;
};

export const generateDateLabels = (count: number): string[] => {
  const labels: string[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    labels.push(date.toLocaleDateString());
  }

  return labels;
};

export const generateMockCandlestickData = (count: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - count);

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const open = 100 + Math.random() * 100;
    const close = open + (Math.random() * 50 - 25);
    const high = Math.max(open, close) + Math.random() * 20;
    const low = Math.min(open, close) - Math.random() * 20;

    data.push({
      x: date.toLocaleDateString(),
      open: open,
      close: close,
      high: high,
      low: low
    });
  }

  return data;
};

export const generatePortfolioData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toISOString().split('T')[0],
      value: 1000 + Math.random() * 500
    });
  }

  return data;
};

export const generateBenchmarkData = (type: string): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 10000 + Math.random() * 5000,
      performance: Math.random() * 15 - 5
    });
  }
  
  return data;
};

export const generateSP500Data = (): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 3000 + Math.random() * 1000,
      performance: Math.random() * 10 - 3
    });
  }
  
  return data;
};

export const generateGoldData = (): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 1500 + Math.random() * 500,
      performance: Math.random() * 8 - 2
    });
  }
  
  return data;
};

export const generateBondsData = (): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 1000 + Math.random() * 200,
      performance: Math.random() * 5 - 1
    });
  }
  
  return data;
};

export const generateRealEstateData = (): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 250000 + Math.random() * 50000,
      performance: Math.random() * 6 - 1
    });
  }
  
  return data;
};

export const generateCommoditiesData = (): { date: string; value: number; performance: number }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: 500 + Math.random() * 100,
      performance: Math.random() * 7 - 2
    });
  }
  
  return data;
};
