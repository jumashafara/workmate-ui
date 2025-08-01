"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define the shape of the context
interface CurrencyContextType {
  currency: 'USD' | 'UGX';
  exchangeRate: number; // 1 USD to UGX
  toggleCurrency: () => void;
  formatCurrency: (amountInUsd: number) => string;
}

// Create the context with a default value
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Define the props for the provider
interface CurrencyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<'USD' | 'UGX'>('USD');
  const exchangeRate = 3600; //  1 USD to 3600 UGX

  const toggleCurrency = () => {
    setCurrency((prevCurrency) => (prevCurrency === 'USD' ? 'UGX' : 'USD'));
  };

  const formatCurrency = (amountInUsd: number) => {
    if (currency === 'UGX') {
      const amountInUgx = amountInUsd * exchangeRate;
      return `UGX ${amountInUgx.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `USD ${amountInUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const value = useMemo(() => ({
    currency,
    exchangeRate,
    toggleCurrency,
    formatCurrency,
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Create a custom hook for using the context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
