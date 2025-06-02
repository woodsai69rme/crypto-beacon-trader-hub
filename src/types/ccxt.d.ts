
declare module 'ccxt' {
  export interface Exchange {
    id: string;
    name: string;
    countries: string[];
    urls: any;
    has: any;
    timeframes: any;
    fees: any;
    apiKey?: string;
    secret?: string;
    password?: string;
    sandbox?: boolean;
    enableRateLimit?: boolean;
    timeout?: number;
    loadMarkets(): Promise<any>;
    fetchBalance(): Promise<any>;
    fetchTicker(symbol: string): Promise<any>;
    fetchStatus(): Promise<any>;
    fetchOrders(symbol?: string): Promise<any>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: number, limit?: number): Promise<number[][]>;
    fetchOrderBook(symbol: string): Promise<any>;
    createOrder(symbol: string, type: string, side: string, amount: number, price?: number): Promise<any>;
    close(): Promise<void>;
  }

  export const binance: new (config?: any) => Exchange;
  export const coinbase: new (config?: any) => Exchange;
  export const kraken: new (config?: any) => Exchange;
  export const bybit: new (config?: any) => Exchange;
  export const okx: new (config?: any) => Exchange;
  export const kucoin: new (config?: any) => Exchange;
  export const bitfinex: new (config?: any) => Exchange;
  export const huobi: new (config?: any) => Exchange;
  export const gateio: new (config?: any) => Exchange;
  export const mexc: new (config?: any) => Exchange;

  const ccxt: {
    [key: string]: new (config?: any) => Exchange;
  };

  export default ccxt;
}
