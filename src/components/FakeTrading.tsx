import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TradingForm from "./trading/TradingForm";
import TradingHoldings from "./trading/TradingHoldings";
import TradeHistory from "./trading/TradeHistory";
import TradingStats from "./trading/TradingStats";
import AccountManager from "./trading/AccountManager";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { useEffect } from "react";
import { SupportedCurrency } from "@/types/trading";
import { Trade, CoinOption } from "@/components/trading/types";

const FakeTrading = () => {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    createAccount,
    deleteAccount,
    addTradeToAccount,
    getActiveAccount
  } = useTradingAccounts();

  const activeAccount = getActiveAccount();

  const {
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    formatValue,
  } = useCurrencyConverter();

  const availableCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32, priceAUD: 90747.07, priceEUR: 56345.12, priceGBP: 48765.43, value: "bitcoin", label: "Bitcoin" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45, priceAUD: 4455.47, priceEUR: 2769.61, priceGBP: 2408.36, value: "ethereum", label: "Ethereum" },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87, priceAUD: 211.45, priceEUR: 131.44, priceGBP: 114.30, value: "solana", label: "Solana" },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, priceAUD: 0.67, priceEUR: 0.41, priceGBP: 0.36, value: "cardano", label: "Cardano" },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57, priceAUD: 0.84, priceEUR: 0.52, priceGBP: 0.46, value: "ripple", label: "XRP" },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14, priceAUD: 0.21, priceEUR: 0.13, priceGBP: 0.11, value: "dogecoin", label: "Dogecoin" },
  ];

  const getOwnedCoinAmount = (coinId: string) => {
    if (!activeAccount) return 0;
    
    return activeAccount.trades
      .filter(trade => trade.coinId === coinId)
      .reduce((total, trade) => {
        if (trade.type === 'buy') {
          return total + trade.amount;
        } else {
          return total - trade.amount;
        }
      }, 0);
  };

  const calculatePortfolioValue = () => {
    if (!activeAccount) return 0;
    
    let totalValue = activeAccount.balance;
    const coinHoldings: { [key: string]: number } = {};
    
    activeAccount.trades.forEach(trade => {
      if (!coinHoldings[trade.coinId]) {
        coinHoldings[trade.coinId] = 0;
      }
      
      if (trade.type === 'buy') {
        coinHoldings[trade.coinId] += trade.amount;
      } else {
        coinHoldings[trade.coinId] -= trade.amount;
      }
    });
    
    Object.entries(coinHoldings).forEach(([coinId, amount]) => {
      if (amount > 0) {
        const coin = availableCoins.find(c => c.id === coinId);
        if (coin) {
          totalValue += coin.price * amount;
        }
      }
    });
    
    return totalValue;
  };

  const calculatePerformance = () => {
    if (!activeAccount) return 0;
    return ((calculatePortfolioValue() - activeAccount.initialBalance) / activeAccount.initialBalance) * 100;
  };

  const handleExecuteTrade = (type: 'buy' | 'sell', coinId: string, amount: number) => {
    if (!activeAccount) return;
    
    const selectedCurrency = activeCurrency as SupportedCurrency;
    const selectedCoin = availableCoins.find(c => c.id === coinId);
    
    if (!selectedCoin) return;
    
    const trade: Trade = {
      id: Date.now().toString(),
      coinId,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type,
      amount,
      price: selectedCoin.price,
      totalValue: amount * selectedCoin.price,
      timestamp: new Date().toISOString(),
      currency: selectedCurrency as SupportedCurrency
    };
    
    addTradeToAccount(activeAccount.id, trade as any);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fake Trading System</CardTitle>
        <CardDescription>Practice trading without real money</CardDescription>
      </CardHeader>
      
      <CardContent>
        <AccountManager 
          accounts={accounts}
          activeAccountId={activeAccountId}
          onSelectAccount={setActiveAccountId}
          onCreateAccount={createAccount}
          onDeleteAccount={deleteAccount}
        />
        
        {activeAccount && (
          <>
            <TradingStats
              balance={activeAccount.balance}
              portfolioValue={calculatePortfolioValue()}
              performance={calculatePerformance()}
              formatValue={formatValue}
              currency={activeCurrency as SupportedCurrency}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TradingForm
                balance={activeAccount.balance}
                availableCoins={availableCoins}
                onExecuteTrade={handleExecuteTrade}
                getOwnedCoinAmount={getOwnedCoinAmount}
                activeCurrency={activeCurrency as SupportedCurrency}
                onCurrencyChange={setActiveCurrency as (currency: SupportedCurrency) => void}
                conversionRate={conversionRates.USD_AUD}
              />
              
              <TradingHoldings
                availableCoins={availableCoins}
                getOwnedCoinAmount={getOwnedCoinAmount}
                onReset={() => deleteAccount(activeAccount.id)}
                formatCurrency={formatValue}
                activeCurrency={activeCurrency as SupportedCurrency}
                conversionRate={conversionRates.USD_AUD}
              />
            </div>
            
            <div className="mt-6">
              <TradeHistory
                trades={activeAccount.trades as Trade[]}
                formatCurrency={formatValue}
                activeCurrency={activeCurrency as SupportedCurrency}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FakeTrading;
