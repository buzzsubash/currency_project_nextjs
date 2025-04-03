// lib/static-data.js
import useSWR from 'swr';

// Function to fetch the currency data
const fetcher = url => fetch(url).then(res => res.json());

// External API endpoint URL
const CURRENCY_API_URL = 'https://buzzsubash.github.io/data/currencies.json';

// Hook to load currency data from the external API
export function useCurrencyData() {
  const { data, error } = useSWR(CURRENCY_API_URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  
  return {
    currencies: data || [],
    isLoading: !error && !data,
    isError: error
  };
}

// Functions to use when we have the data
export function getCurrencyByCode(currencies, code) {
  return currencies.find(currency => currency.code === code);
}