
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { AiTradingProvider } from '@/contexts/AiTradingContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { UIProvider } from '@/contexts/UIContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Crypto Trading Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider>
          <UIProvider>
            <CurrencyProvider>
              <AiTradingProvider>
                {children}
                <Toaster />
              </AiTradingProvider>
            </CurrencyProvider>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
