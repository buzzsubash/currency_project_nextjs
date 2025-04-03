// lib/types.ts
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface ConversionTableItem {
  amount: number;
  sgd_to_myr: number;
  myr_to_sgd: number;
}

export interface OtherCurrencyConversion {
  amount: number;
  from_to_conversion: number;
  to_from_conversion: number;
}

export interface CurrencyHookResult {
  currencies: Currency[];
  isLoading: boolean;
  isError: boolean;
}