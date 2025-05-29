
export interface IndicatorResult {
  name: string;
  value: number | number[];
  signal: 'BUY' | 'SELL' | 'HOLD';
  timestamp: number;
}

export class TechnicalIndicators {
  // Simple Moving Average
  calculateSMA(prices: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  // Exponential Moving Average
  calculateEMA(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    return ema;
  }

  // Relative Strength Index
  calculateRSI(prices: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const changes: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    let avgGain = 0;
    let avgLoss = 0;
    
    // Initial average gain and loss
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) {
        avgGain += changes[i];
      } else {
        avgLoss += Math.abs(changes[i]);
      }
    }
    
    avgGain /= period;
    avgLoss /= period;
    
    let rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
    
    // Calculate subsequent RSI values
    for (let i = period; i < changes.length; i++) {
      const gain = changes[i] > 0 ? changes[i] : 0;
      const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;
      
      avgGain = ((avgGain * (period - 1)) + gain) / period;
      avgLoss = ((avgLoss * (period - 1)) + loss) / period;
      
      rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    return rsi;
  }

  // MACD (Moving Average Convergence Divergence)
  calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    
    const macdLine: number[] = [];
    const startIndex = Math.max(fastEMA.length, slowEMA.length) - Math.min(fastEMA.length, slowEMA.length);
    
    for (let i = startIndex; i < Math.min(fastEMA.length, slowEMA.length); i++) {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
    
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[i + (macdLine.length - signalLine.length)] - signalLine[i]);
    }
    
    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram
    };
  }

  // Bollinger Bands
  calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const upperBand: number[] = [];
    const lowerBand: number[] = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upperBand.push(mean + (standardDeviation * stdDev));
      lowerBand.push(mean - (standardDeviation * stdDev));
    }
    
    return {
      upper: upperBand,
      middle: sma,
      lower: lowerBand
    };
  }

  // Stochastic Oscillator
  calculateStochastic(highs: number[], lows: number[], closes: number[], kPeriod: number = 14, dPeriod: number = 3) {
    const kPercent: number[] = [];
    
    for (let i = kPeriod - 1; i < closes.length; i++) {
      const highestHigh = Math.max(...highs.slice(i - kPeriod + 1, i + 1));
      const lowestLow = Math.min(...lows.slice(i - kPeriod + 1, i + 1));
      const currentClose = closes[i];
      
      kPercent.push(((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100);
    }
    
    const dPercent = this.calculateSMA(kPercent, dPeriod);
    
    return {
      k: kPercent,
      d: dPercent
    };
  }

  // Williams %R
  calculateWilliamsR(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
    const williamsR: number[] = [];
    
    for (let i = period - 1; i < closes.length; i++) {
      const highestHigh = Math.max(...highs.slice(i - period + 1, i + 1));
      const lowestLow = Math.min(...lows.slice(i - period + 1, i + 1));
      const currentClose = closes[i];
      
      williamsR.push(((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100);
    }
    
    return williamsR;
  }

  // Average Directional Index (ADX)
  calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14) {
    const trueRanges: number[] = [];
    const plusDM: number[] = [];
    const minusDM: number[] = [];
    
    for (let i = 1; i < closes.length; i++) {
      const high = highs[i];
      const low = lows[i];
      const close = closes[i];
      const prevHigh = highs[i - 1];
      const prevLow = lows[i - 1];
      const prevClose = closes[i - 1];
      
      const tr1 = high - low;
      const tr2 = Math.abs(high - prevClose);
      const tr3 = Math.abs(low - prevClose);
      trueRanges.push(Math.max(tr1, tr2, tr3));
      
      const upMove = high - prevHigh;
      const downMove = prevLow - low;
      
      plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }
    
    const smoothedTR = this.calculateEMA(trueRanges, period);
    const smoothedPlusDM = this.calculateEMA(plusDM, period);
    const smoothedMinusDM = this.calculateEMA(minusDM, period);
    
    const plusDI: number[] = [];
    const minusDI: number[] = [];
    const dx: number[] = [];
    
    for (let i = 0; i < smoothedTR.length; i++) {
      const pdi = (smoothedPlusDM[i] / smoothedTR[i]) * 100;
      const mdi = (smoothedMinusDM[i] / smoothedTR[i]) * 100;
      
      plusDI.push(pdi);
      minusDI.push(mdi);
      
      const dxValue = Math.abs(pdi - mdi) / (pdi + mdi) * 100;
      dx.push(dxValue);
    }
    
    const adx = this.calculateEMA(dx, period);
    
    return {
      adx: adx,
      plusDI: plusDI,
      minusDI: minusDI
    };
  }

  // Commodity Channel Index (CCI)
  calculateCCI(highs: number[], lows: number[], closes: number[], period: number = 20): number[] {
    const cci: number[] = [];
    const typicalPrices: number[] = [];
    
    for (let i = 0; i < closes.length; i++) {
      typicalPrices.push((highs[i] + lows[i] + closes[i]) / 3);
    }
    
    for (let i = period - 1; i < typicalPrices.length; i++) {
      const slice = typicalPrices.slice(i - period + 1, i + 1);
      const sma = slice.reduce((sum, price) => sum + price, 0) / period;
      const meanDeviation = slice.reduce((sum, price) => sum + Math.abs(price - sma), 0) / period;
      
      cci.push((typicalPrices[i] - sma) / (0.015 * meanDeviation));
    }
    
    return cci;
  }

  // Generate trading signals based on multiple indicators
  generateSignals(prices: number[], highs: number[], lows: number[], closes: number[]): IndicatorResult[] {
    const results: IndicatorResult[] = [];
    const currentPrice = prices[prices.length - 1];
    
    // RSI Signal
    const rsi = this.calculateRSI(prices);
    const currentRSI = rsi[rsi.length - 1];
    let rsiSignal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (currentRSI < 30) rsiSignal = 'BUY';
    else if (currentRSI > 70) rsiSignal = 'SELL';
    
    results.push({
      name: 'RSI',
      value: currentRSI,
      signal: rsiSignal,
      timestamp: Date.now()
    });
    
    // MACD Signal
    const macd = this.calculateMACD(prices);
    const currentMACD = macd.macd[macd.macd.length - 1];
    const currentSignal = macd.signal[macd.signal.length - 1];
    const macdSignal: 'BUY' | 'SELL' | 'HOLD' = currentMACD > currentSignal ? 'BUY' : 'SELL';
    
    results.push({
      name: 'MACD',
      value: [currentMACD, currentSignal],
      signal: macdSignal,
      timestamp: Date.now()
    });
    
    // Bollinger Bands Signal
    const bb = this.calculateBollingerBands(prices);
    const upperBand = bb.upper[bb.upper.length - 1];
    const lowerBand = bb.lower[bb.lower.length - 1];
    let bbSignal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (currentPrice <= lowerBand) bbSignal = 'BUY';
    else if (currentPrice >= upperBand) bbSignal = 'SELL';
    
    results.push({
      name: 'Bollinger Bands',
      value: [upperBand, bb.middle[bb.middle.length - 1], lowerBand],
      signal: bbSignal,
      timestamp: Date.now()
    });
    
    return results;
  }
}

export const technicalIndicators = new TechnicalIndicators();
