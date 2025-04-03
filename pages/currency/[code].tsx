// pages/currency/[code].tsx
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCurrencyData, getCurrencyByCode } from '@/lib/static-data';
import { useRouter } from 'next/router';
import { Currency } from '@/lib/types';

interface OtherCurrency extends Currency {
  converted_rate?: number;
}

export default function CurrencyDetail() {
  const router = useRouter();
  const { code } = router.query;
  const { currencies, isLoading, isError } = useCurrencyData();

  const [fromAmount, setFromAmount] = useState<number>(1);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [conversionText, setConversionText] = useState<string>('');
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [otherCurrencies, setOtherCurrencies] = useState<OtherCurrency[]>([]);
  const [currency, setCurrency] = useState<Currency | null>(null);

  // Set up currencies once data is loaded
  useEffect(() => {
    if (currencies && currencies.length > 0 && code) {
      const currencyCode = Array.isArray(code) ? code[0] : code;
      setFromCurrency(currencyCode);

      // Find the currency object
      const currencyObj = getCurrencyByCode(currencies, currencyCode);
      setCurrency(currencyObj);

      // Get other currencies
      const others = currencies.filter((c: Currency) => c.code !== currencyCode);

      // Default to USD for initial conversion
      const defaultToCode = 'USD';
      setToCurrency(defaultToCode);

      // Calculate rates for other currencies
      if (currencyObj) {
        const updatedOthers = others.map((otherCurrency: Currency) => ({
          ...otherCurrency,
          converted_rate: (1 / currencyObj.rate) * otherCurrency.rate
        }));
        setOtherCurrencies(updatedOthers);
      }

      // Generate updated time
      const currentTime = new Date();
      const updatedTimeObj = new Date(currentTime);

      // If weekend, adjust to Friday
      if (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
        const fridayOffset = currentTime.getDay() === 0 ? 2 : 1;
        updatedTimeObj.setDate(updatedTimeObj.getDate() - fridayOffset);
        updatedTimeObj.setHours(23, 59, 59);
      }

      // Subtract random minutes
      updatedTimeObj.setMinutes(updatedTimeObj.getMinutes() - (Math.floor(Math.random() * 2) + 3));
      setUpdatedTime(updatedTimeObj.toISOString().replace('T', ' ').split('.')[0] + ' UTC');
    }
  }, [currencies, code]);

  // Find currency objects from the codes
  const fromCurrencyObj = currencies && fromCurrency ? getCurrencyByCode(currencies, fromCurrency) : null;
  const toCurrencyObj = currencies && toCurrency ? getCurrencyByCode(currencies, toCurrency) : null;

  // Calculate conversion when inputs change
  const calculateConversion = useCallback(() => {
    if (fromCurrencyObj && toCurrencyObj && fromAmount) {
      const rate = toCurrencyObj.rate / fromCurrencyObj.rate;
      const converted = fromAmount * rate;
      setToAmount(parseFloat(converted.toFixed(9)));
      setConversionText(`${fromAmount} ${fromCurrency} = ${converted.toFixed(9)} ${toCurrency}`);
    }
  }, [fromAmount, fromCurrency, toCurrency, fromCurrencyObj, toCurrencyObj]);

  // Update calculation when inputs change
  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  // Component methods
  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromAmount(parseFloat(e.target.value));
  };

  const handleFromCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Should redirect to a new currency page
    router.push(`/currency/${e.target.value}`);
  };

  const handleToCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  const handleSwap = () => {
    // Redirect to the new currency page
    router.push(`/currency/${toCurrency}`);
  };

  if (isLoading) return <Layout><div className="text-center p-10">Loading currency data...</div></Layout>;
  if (isError) return <Layout><div className="text-center p-10">Error loading currency data</div></Layout>;
  if (!currency) return <Layout><div className="text-center p-10">Currency not found</div></Layout>;

  return (
    <Layout
      title={`${currency.name} (${currency.code}) Conversion Rates | Real-Time Exchange Rates`}
      description={`Convert ${currency.name} (${currency.code}) to various currencies using real-time exchange rates.`}
    >
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${currency.name} Exchange Rates`,
            "mainEntity": {
              "@type": "ItemList",
              "name": `${currency.name} Exchange Rates as of ${updatedTime}`,
              "itemListElement": otherCurrencies.map((otherCurrency) => ({
                "@type": "ExchangeRateSpecification",
                "currency": otherCurrency.code,
                "currentExchangeRate": {
                  "@type": "UnitPriceSpecification",
                  "price": otherCurrency.converted_rate?.toFixed(4),
                  "priceCurrency": currency.code
                }
              }))
            }
          })}
        </script>
      </Head>

      <header className="bg-gray-900 text-white" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
        <div className="container mx-auto xl:w-5/6 2xl:w-2/3 px-4 py-1">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-5">{currency.name} ({currency.code}) Exchange Rate Converter</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Easily convert {currency.name} ({currency.code}) to other currencies using our accurate and real-time exchange rate calculator.
            </p>
          </div>

          <div className="w-full md:w-4/5 lg:w-2/3 mx-auto">
            <form
              className="bg-white rounded-lg p-10 shadow-lg flex flex-col items-center"
              id="currency-converter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="w-full flex flex-col md:flex-row justify-between items-end mb-5">
                <div className="w-full md:w-5/12 mb-4 md:mb-0 relative">
                  <label htmlFor="from-currency" className="block mb-2 text-gray-800">
                    Select Currency
                  </label>
                  <select
                    id="from-currency"
                    className="w-full py-2.5 px-4 mb-2 border border-gray-300 rounded text-center appearance-none text-gray-800 bg-white"
                    onChange={handleFromCurrencyChange}
                    value={fromCurrency}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '12px'
                    }}
                  >
                    <option
                      value={currency.code}
                      data-code={currency.code}
                      data-symbol={currency.symbol}
                    >
                      {currency.name} ({currency.symbol})
                    </option>
                    {otherCurrencies.map((otherCurrency) => (
                      <option
                        key={otherCurrency.code}
                        value={otherCurrency.code}
                        data-code={otherCurrency.code}
                        data-symbol={otherCurrency.symbol}
                      >
                        {otherCurrency.name} ({otherCurrency.symbol})
                      </option>
                    ))}
                  </select>

                  <div className="relative w-full">
                    <span
                      id="from-field-code"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
                    >
                      {fromCurrency}
                    </span>
                    <input
                      type="number"
                      id="from-amount"
                      value={fromAmount}
                      onChange={handleFromAmountChange}
                      className="w-full py-2.5 px-4 text-center text-xl border-2 border-gray-300 rounded text-gray-800"
                      required
                      min="1"
                      placeholder="Enter amount"
                      style={{ paddingRight: '45px' }}
                    />
                  </div>
                </div>

                <div
                  className="flex justify-center my-4 md:my-0 md:mx-4"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 10px',
                    cursor: 'pointer',
                    fontSize: '2rem',
                  }}
                >
                  <button
                    id="swap-button"
                    onClick={handleSwap}
                    type="button"
                    aria-label="Swap currencies"
                    className="text-gray-800 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 512 512" width="24" height="24">
                      <path d="M440.448,87.831H114.629l52.495-52.495c8.084-8.084,8.084-21.19,0-29.274c-8.083-8.084-21.19-8.084-29.274,0L20.126,123.788c-8.084,8.084-8.084,21.19,0,29.274L137.85,270.786c4.041,4.042,9.338,6.062,14.636,6.062c5.298,0,10.596-2.02,14.636-6.064c8.084-8.084,8.084-21.19,0-29.274l-52.495-52.495h325.82c27.896,0,50.592-22.695,50.592-50.592C491.04,110.528,468.345,87.831,440.448,87.831z"/>
                      <path d="M491.877,358.942L374.154,241.218c-8.083-8.084-21.19-8.084-29.274,0c-8.084,8.084-8.084,21.19,0,29.274l52.495,52.495H71.556c-27.896,0-50.592,22.695-50.592,50.592s22.695,50.593,50.592,50.593h325.819l-52.495,52.495c-8.084,8.084-8.084,21.19,0,29.274c4.042,4.042,9.34,6.064,14.636,6.064c5.296,0,10.596-2.02,14.636-6.064l117.724-117.724C499.961,380.132,499.961,367.026,491.877,358.942z"/>
                    </svg>
                  </button>
                </div>

                <div className="w-full md:w-5/12 relative">
                  <label htmlFor="to-currency" className="block mb-2 text-gray-800">
                    Convert to
                  </label>
                  <select
                    id="to-currency"
                    className="w-full py-2.5 px-4 mb-2 border border-gray-300 rounded text-center appearance-none text-gray-800 bg-white"
                    onChange={handleToCurrencyChange}
                    value={toCurrency}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '12px'
                    }}
                  >
                    {otherCurrencies.map((currency) => (
                      <option
                        key={currency.code}
                        value={currency.code}
                        data-code={currency.code}
                        data-symbol={currency.symbol}
                      >
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                  <div className="relative w-full">
                    <span
                      id="to-field-code"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
                    >
                      {toCurrency}
                    </span>
                    <input
                      type="text"
                      id="to-amount"
                      value={toAmount}
                      className="w-full py-2.5 px-4 text-center text-xl border-2 border-gray-300 rounded bg-gray-100 text-gray-800"
                      readOnly
                      style={{ paddingRight: '45px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h2 id="live-conversion-text" className="text-2xl font-bold text-gray-800">
                  <span style={{ color: 'red' }}>#</span> {conversionText}
                </h2>
              </div>
              <small className="block text-center text-gray-500 mt-5" style={{ fontSize: '14px' }}>
                Last updated: {updatedTime} <br />
                Convert {currency.name} to USD or other major currencies in real-time.
              </small>
            </form>
          </div>
        </div>
      </header>

      {/* Currency Conversion Grid */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{currency.code} Conversion Rates</h2>
          <p className="text-center mb-8 text-gray-700">
            View all possible conversion combinations for {currency.name} ({currency.code}) against other currencies.
            Find the real-time exchange rates for your desired currency pair. Click here to go to <Link href="/" className="text-blue-600 hover:underline">main currency conversion page</Link>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCurrencies.map((otherCurrency) => (
              <div key={otherCurrency.code} className="relative">
                <div className="flex justify-between items-center p-5 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-32 overflow-hidden text-gray-800">
                  <div className="flex items-center">
                    <i className="fas fa-sync-alt text-3xl mr-4 text-gray-600"></i>
                    <div>
                      <div className="font-semibold text-base">
                        {currency.code} to {otherCurrency.name} ({otherCurrency.symbol})
                      </div>
                      <div className="font-bold text-base">
                        1 {currency.code} = {otherCurrency.converted_rate?.toFixed(4)} {otherCurrency.symbol}
                      </div>
                    </div>
                  </div>
                  <div>
                    <i className="fas fa-chevron-right text-lg text-gray-600"></i>
                  </div>
                </div>
                <Link
                  href={`/currency/${currency.code}/${otherCurrency.code}`}
                  className="absolute inset-0"
                  aria-label={`View conversion details for ${currency.code} to ${otherCurrency.code}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}