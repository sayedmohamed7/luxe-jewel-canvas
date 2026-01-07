import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Currency {
  code: "AED" | "USD" | "SAR";
  symbol: string;
  name: string;
  nameAr: string;
  rate: number; // Rate relative to AED (base)
}

export const currencies: Currency[] = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", nameAr: "درهم إماراتي", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", nameAr: "دولار أمريكي", rate: 0.27 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", nameAr: "ريال سعودي", rate: 1.02 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInAED: number) => string;
  convertPrice: (priceInAED: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("currency");
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) return found;
    }
    return currencies[0]; // Default to AED
  });

  useEffect(() => {
    localStorage.setItem("currency", currency.code);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const convertPrice = (priceInAED: number): number => {
    return Math.round(priceInAED * currency.rate);
  };

  const formatPrice = (priceInAED: number): string => {
    const converted = convertPrice(priceInAED);
    return new Intl.NumberFormat(currency.code === "AED" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
