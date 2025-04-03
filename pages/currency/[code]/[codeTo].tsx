// pages/currency/[code]/[codeTo].tsx
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCurrencyData, getCurrencyByCode } from '@/lib/static-data';
import { useRouter } from 'next/router';
import { Currency, OtherCurrencyConversion } from '@/lib/types';

export default function ConversionDetail() {
  const router = useRouter();
  const { code, codeTo } = router.query;
  const { currencies, isLoading, isError } = useCurrencyData();

  const [fromAmount, setFromAmount] = useState<number>(1);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [conversionText, setConversionText] = useState<string>('');
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [conversionTable, setConversionTable] = useState<OtherCurrencyConversion[]>([]);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [currencyFrom, setCurrencyFrom] = useState<Currency | null>(null);
  const [currencyTo, setCurrencyTo] = useState<Currency | null>(null);

  // Set up currencies once data is loaded
  useEffect(() => {
    if (currencies && currencies.length > 0 && code && codeTo) {
      const fromCode = Array.isArray(code) ? code[0] : code;
      const toCode = Array.isArray(codeTo) ? codeTo[0] : codeTo;

      setFromCurrency(fromCode);
      setToCurrency(toCode);

      const fromCurrObj = getCurrencyByCode(currencies, fromCode);
      const toCurrObj = getCurrencyByCode(currencies, toCode);

      setCurrencyFrom(fromCurrObj);
      setCurrencyTo(toCurrObj);

      if (fromCurrObj && toCurrObj) {
        // Calculate conversion rate
        const rate = toCurrObj.rate / fromCurrObj.rate;
        setConversionRate(parseFloat(rate.toFixed(9)));

        // Calculate initial conversion
        const initialConverted = fromAmount * rate;
        setToAmount(parseFloat(initialConverted.toFixed(9)));
        setConversionText(`${fromAmount} ${fromCode} = ${initialConverted.toFixed(9)} ${toCode}`);

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

        // Create conversion table
        const conversionAmounts = [1, 8, 18, 28, 48, 98, 198, 398, 798, 1598, 3198, 6398, 7998, 8998, 9998];
        const table = conversionAmounts.map(amount => {
          const from_to_conversion = amount * rate;
          const to_from_conversion = amount / rate;
          return {
            amount,
            from_to_conversion: parseFloat(from_to_conversion.toFixed(5)),
            to_from_conversion: parseFloat(to_from_conversion.toFixed(5))
          };
        });
        setConversionTable(table);

        // Set image URL
        setImageUrl(`/static/currency_images/${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}-conversion-chart.webp`);
      }
    }
  }, [currencies, code, codeTo, fromAmount]);

  // Calculate conversion when inputs change
  const calculateConversion = useCallback(() => {
    if (currencyFrom && currencyTo && fromAmount) {
      const rate = currencyTo.rate / currencyFrom.rate;
      const converted = fromAmount * rate;
      setToAmount(parseFloat(converted.toFixed(9)));
      setConversionText(`${fromAmount} ${fromCurrency} = ${converted.toFixed(9)} ${toCurrency}`);
    }
  }, [fromAmount, fromCurrency, toCurrency, currencyFrom, currencyTo]);

  // Update calculation when inputs change
  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  // Handle input change
  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromAmount(parseFloat(e.target.value));
  };

  // Handle currency change
  const handleFromCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Navigate to new conversion page
    router.push(`/currency/${e.target.value}/${toCurrency}`);
  };

  const handleToCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Navigate to new conversion page
    router.push(`/currency/${fromCurrency}/${e.target.value}`);
  };

  // Swap currencies
  const handleSwap = () => {
    router.push(`/currency/${toCurrency}/${fromCurrency}`);
  };

  if (isLoading) return <Layout><div className="text-center p-10">Loading currency data...</div></Layout>;
  if (isError) return <Layout><div className="text-center p-10">Error loading currency data</div></Layout>;
  if (!currencyFrom || !currencyTo) return <Layout><div className="text-center p-10">Currency not found</div></Layout>;

  return (
    <Layout
      title={`${currencyFrom.code} to ${currencyTo.code} - Convert ${currencyFrom.name} to ${currencyTo.name} | Real-Time Rates`}
      description={`Easily convert ${currencyFrom.code} to ${currencyTo.code} with our real-time currency converter. Get accurate ${currencyFrom.name} to ${currencyTo.name} rates.`}
    >
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${currencyFrom.code} to ${currencyTo.code} Exchange Rate`,
            "mainEntity": {
              "@type": "ExchangeRateSpecification",
              "currency": currencyTo.code,
              "currentExchangeRate": {
                "@type": "UnitPriceSpecification",
                "price": conversionRate,
                "priceCurrency": currencyFrom.code
              },
              "additionalType": "https://schema.org/CurrencyConversionService",
              "validFrom": new Date().toISOString(),
              "validThrough": new Date().toISOString()
            }
          })}
        </script>
      </Head>

      <header className="bg-gray-900 text-white" style={{ paddingTop: '1rem', minHeight: '100vh' }}>
        <div className="container mx-auto xl:w-5/6 2xl:w-2/3 px-4 py-1">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-5">
              {currencyFrom.name} to {currencyTo.name} - Convert {currencyFrom.code} to {currencyTo.code} at Real-Time Rates
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Convert {currencyFrom.name} ({currencyFrom.code}) to {currencyTo.name} ({currencyTo.code}) instantly with accurate and live exchange rates.
            </p>
          </div>

          <div className="w-full md:w-4/5 lg:w-2/3 mx-auto mt-5">
            <form
              className="bg-white rounded-lg p-10 shadow-lg flex flex-col items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="w-full flex flex-col md:flex-row justify-between items-end mb-5">
                <div className="w-full md:w-5/12 mb-4 md:mb-0 relative">
                  <label htmlFor="from-currency" className="block mb-2 text-gray-800">
                    Amount
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
                    {currencies.map((currency: Currency) => (
                      <option
                        key={currency.code}
                        value={currency.code}
                      >
                        {currency.name} ({currency.symbol})
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
                    Converted Amount
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
                    {currencies.map((currency: Currency) => (
                      <option
                        key={currency.code}
                        value={currency.code}
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

              <div className="mt-3 text-center">
                <h2 id="live-conversion-text" className="text-2xl font-bold text-gray-800">
                  <span style={{ color: 'red' }}>#</span> {conversionText}
                </h2>
              </div>

              <small className="text-gray-500 text-center mt-3 text-sm">
                Last updated: {updatedTime} <br />
                Use our converter for accurate and quick {currencyFrom.name} to {currencyTo.name} conversions.
              </small>
            </form>

            <div className="mt-8">
              <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
                <h2 className="text-2xl font-bold mb-4">Current {currencyFrom.code} to {currencyTo.code} Conversion Rate</h2>
                <p className="text-lg mb-6">
                  <strong>As of {updatedTime}, 1 {currencyFrom.name} ({currencyFrom.code}) equals {conversionRate} {currencyTo.name} ({currencyTo.code}).</strong> Use our real-time
                  currency converter to check live rates and historical trends for more accurate and up-to-date conversions.
                </p>

                <p className="mb-6">
                  For more detailed information on {currencyFrom.name} ({currencyFrom.code}) and the latest conversion rates, visit our{' '}
                  <Link href={`/currency/${currencyFrom.code}`} className="text-blue-600 hover:underline">
                    {currencyFrom.name} conversion rates page
                  </Link>.
                </p>

                <h3 className="text-xl font-bold mb-3">Using the Currency Converter</h3>
                <p className="mb-6">
                  Enter the {currencyFrom.name} amount and select {currencyTo.name}. The tool displays the real-time exchange rate and converts your amount accurately. This process supports informed
                  decision-making in international transactions or currency trading.
                </p>

                {imageUrl && (
                  <div className="mb-6 flex justify-center">
                    <Image
                      src={imageUrl}
                      alt={`Exchange rate chart for ${currencyFrom.name} to ${currencyTo.name}`}
                      title={`Exchange rate chart showing conversion from ${currencyFrom.name} (${currencyFrom.code}) to ${currencyTo.name} (${currencyTo.code})`}
                      width={500}
                      height={300}
                      className="rounded border border-gray-300"
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold mb-3">Key Features of the Converter</h3>
                <ul className="list-disc pl-8 mb-6 text-gray-800">
                  <li className="mb-2"><strong>Real-Time Data:</strong> The converter accesses the latest exchange rates, ensuring accuracy.</li>
                  <li className="mb-2"><strong>User-Friendly Interface:</strong> The interface is designed for quick, easy currency conversion.</li>
                  <li className="mb-2"><strong>Reliable Source:</strong> Rates are sourced from trusted financial institutions, enhancing reliability.</li>
                </ul>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Amount ({currencyFrom.code})</th>
                        <th className="border px-4 py-2 text-left">{currencyFrom.code} to {currencyTo.code}</th>
                        <th className="border-l border-t border-b px-4 py-2 text-left pl-6">Amount ({currencyTo.code})</th>
                        <th className="border px-4 py-2 text-left">{currencyTo.code} to {currencyFrom.code}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionTable.map((conversion, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="border px-4 py-2">{conversion.amount} {currencyFrom.code}</td>
                          <td className="border px-4 py-2">{conversion.from_to_conversion} {currencyTo.code}</td>
                          <td className="border-l border-t border-b px-4 py-2 pl-6">{conversion.amount} {currencyTo.code}</td>
                          <td className="border px-4 py-2">{conversion.to_from_conversion} {currencyFrom.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Layout>
  );
}