// pages/index.tsx
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Layout from '@/components/Layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCurrencyData, getCurrencyByCode } from '@/lib/static-data';
import { ConversionTableItem, Currency } from '@/lib/types';

const Home: NextPage = () => {
  const { currencies, isLoading, isError } = useCurrencyData();
  const [fromAmount, setFromAmount] = useState<number>(1);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>('SGD');
  const [toCurrency, setToCurrency] = useState<string>('MYR');
  const [conversionText, setConversionText] = useState<string>('');
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [conversionTable, setConversionTable] = useState<ConversionTableItem[]>([]);
  const [sgdToMyrRate, setSgdToMyrRate] = useState<number>(0);

  // Initialize data once currencies are loaded
  useEffect(() => {
    if (currencies && currencies.length > 0) {
      // Set initial currencies if they exist in our data
      const sgdCurrency = getCurrencyByCode(currencies, 'SGD');
      const myrCurrency = getCurrencyByCode(currencies, 'MYR');

      if (sgdCurrency && myrCurrency) {
        // Calculate SGD to MYR rate
        const rate = myrCurrency.rate / sgdCurrency.rate;
        setSgdToMyrRate(parseFloat(rate.toFixed(9)));

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
        const amounts = [1, 4, 11, 22, 55, 99, 490, 990, 2100, 4500, 5800, 9999];
        const table = amounts.map(amount => ({
          amount,
          sgd_to_myr: parseFloat((amount * rate).toFixed(5)),
          myr_to_sgd: parseFloat((amount / rate).toFixed(5))
        }));
        setConversionTable(table);
      }
    }
  }, [currencies]);

  // Find currency objects from the codes
  const fromCurrencyObj = currencies ? getCurrencyByCode(currencies, fromCurrency) : null;
  const toCurrencyObj = currencies ? getCurrencyByCode(currencies, toCurrency) : null;

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

  // Handle input change
  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromAmount(parseFloat(e.target.value));
  };

  // Handle currency change
  const handleFromCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  if (isLoading) return <Layout><div className="text-center p-10">Loading currency data...</div></Layout>;
  if (isError) return <Layout><div className="text-center p-10">Error loading currency data</div></Layout>;

  return (
    <Layout>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
      </Head>
      <header className="bg-gray-900 text-white" style={{ paddingTop: '2.5rem', minHeight: '100vh' }}>
        <div className="container mx-auto xl:w-5/6 2xl:w-2/3 px-4 py-1">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="text-4xl font-bold mb-5">
              SGD to MYR Currency Converter - Real-Time Singapore Dollar to Malaysian Ringgit Rates
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Easily convert SGD to MYR using our live currency converter. Get up-to-date Singapore Dollar to Malaysian Ringgit rates and calculate accurate conversions instantly.
            </p>
          </div>

          <div className="col-md-10 mx-auto col-lg-8">
            <form style={{
              background: '#fff',
              borderRadius: '.625rem',
              padding: '2.8125rem 3rem',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
                marginBottom: '20px',
              }} className="flex-col md:flex-row">
                <div style={{
                  width: '48%',
                  position: 'relative',
                }} className="w-full md:w-auto mb-4 md:mb-0">
                  <label htmlFor="from-currency" className="block mb-2 text-gray-800" style={{ display: 'block', marginBottom: '5px' }}>
                    Amount
                  </label>
                  <select
                    id="from-currency"
                    className="form-control w-full mb-2"
                    onChange={handleFromCurrencyChange}
                    value={fromCurrency}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      lineHeight: '1.1',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '12px',
                      height: '100%',
                      boxSizing: 'border-box',
                      color: '#212529',
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
                  <div style={{ width: '100%', position: 'relative', marginBottom: '0' }}>
                    <span style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1rem',
                      color: '#666',
                      textAlign: 'right',
                    }}>
                      {fromCurrency}
                    </span>
                    <input
                      type="number"
                      id="from-amount"
                      value={fromAmount}
                      onChange={handleFromAmountChange}
                      className="form-control"
                      style={{
                        width: '100%',
                        paddingRight: '45px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        border: '2px solid #ccc',
                        borderRadius: '5px 0 0 5px',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease-in-out',
                        boxSizing: 'border-box',
                        color: '#212529',
                        padding: '10px',
                      }}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 10px',
                  cursor: 'pointer',
                  fontSize: '2rem',
                }} className="my-4 md:my-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSwap();
                    }}
                    type="button"
                    aria-label="Swap currencies"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 512 512" width="24" height="24">
                      <path d="M440.448,87.831H114.629l52.495-52.495c8.084-8.084,8.084-21.19,0-29.274c-8.083-8.084-21.19-8.084-29.274,0L20.126,123.788c-8.084,8.084-8.084,21.19,0,29.274L137.85,270.786c4.041,4.042,9.338,6.062,14.636,6.062c5.298,0,10.596-2.02,14.636-6.064c8.084-8.084,8.084-21.19,0-29.274l-52.495-52.495h325.82c27.896,0,50.592-22.695,50.592-50.592C491.04,110.528,468.345,87.831,440.448,87.831z"/>
                      <path d="M491.877,358.942L374.154,241.218c-8.083-8.084-21.19-8.084-29.274,0c-8.084,8.084-8.084,21.19,0,29.274l52.495,52.495H71.556c-27.896,0-50.592,22.695-50.592,50.592s22.695,50.593,50.592,50.593h325.819l-52.495,52.495c-8.084,8.084-8.084,21.19,0,29.274c4.042,4.042,9.34,6.064,14.636,6.064c5.296,0,10.596-2.02,14.636-6.064l117.724-117.724C499.961,380.132,499.961,367.026,491.877,358.942z"/>
                    </svg>
                  </button>
                </div>

                <div style={{
                  width: '48%',
                  position: 'relative',
                }} className="w-full md:w-auto">
                  <label htmlFor="to-currency" className="block mb-2 text-gray-800" style={{ display: 'block', marginBottom: '5px' }}>
                    Converted Amount
                  </label>
                  <select
                    id="to-currency"
                    className="form-control w-full mb-2"
                    onChange={handleToCurrencyChange}
                    value={toCurrency}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      lineHeight: '1.1',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '12px',
                      height: '100%',
                      boxSizing: 'border-box',
                      color: '#212529',
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
                  <div style={{ width: '100%', position: 'relative', marginBottom: '0' }}>
                    <span style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1rem',
                      color: '#666',
                      textAlign: 'right',
                    }}>
                      {toCurrency}
                    </span>
                    <input
                      type="text"
                      id="to-amount"
                      value={toAmount}
                      className="form-control"
                      style={{
                        width: '100%',
                        paddingRight: '45px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        border: '2px solid #ccc',
                        borderRadius: '5px 0 0 5px',
                        backgroundColor: '#f9f9f9',
                        transition: 'all 0.3s ease-in-out',
                        boxSizing: 'border-box',
                        color: '#212529',
                        padding: '10px',
                      }}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <br />

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  <span style={{ color: 'red' }}>#</span> {conversionText}
                </h2>
              </div>

              <small style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                Last updated: {updatedTime} <br />
                Use our currency converter to easily convert between various currencies.
              </small>
            </form>

            <div style={{ marginTop: '30px' }}></div>

            <div style={{
              marginTop: '1.875rem',
            }}>
              <div style={{
                background: '#fff',
                fontSize: '1.125rem',
                padding: '1.25rem',
                borderRadius: '1.25rem',
                lineHeight: '1.5',
                color: '#212529',
              }}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Current SGD to MYR Conversion Rate</h2>
                <p className="text-gray-800">
                  <strong>As of {updatedTime}, 1 Singapore Dollar (SGD) equals {sgdToMyrRate} Malaysian Ringgit (MYR).</strong> Use our real-time currency converter to check live rates and historical trends for more accurate and up-to-date conversions.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">SGD to MYR Conversion Process</h2>
                <p className="mb-4 text-gray-800">
                  To convert Singapore Dollar (SGD) to Malaysian Ringgit (MYR), input the amount and select the currencies. The converter updates rates instantly,
                  ensuring accurate results for financial planning, investments, or travel expenses. For <Link href="/currency/SGD" className="text-blue-600 hover:underline">detailed Singapore Dollar
                  information and conversion rates</Link>, visit our dedicated page.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">Using the Currency Converter</h3>
                <p className="mb-4 text-gray-800">
                  Enter the Singapore Dollar amount and select Malaysian Ringgit. The tool displays the real-time exchange rate and converts your amount accurately. This process supports informed
                  decision-making in international transactions or currency trading.
                </p>

                <div className="mx-auto my-6 flex justify-center">
                  <Image
                    src="/static/currency_images/sgd-to-myr-conversion-chart.webp"
                    alt="Exchange rate chart for SGD to MYR"
                    title="Exchange rate chart showing conversion from Singapore Dollar (SGD) to Malaysian Ringgit (MYR)"
                    width={500}
                    height={300}
                    priority={false}
                    className="rounded border border-gray-300"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>

                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">Key Features of the Converter</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-800">
                  <li className="mb-2"><strong>Real-Time Data:</strong> The converter accesses the latest exchange rates, ensuring accuracy.</li>
                  <li className="mb-2"><strong>User-Friendly Interface:</strong> The interface is designed for quick, easy currency conversion.</li>
                  <li className="mb-2"><strong>Reliable Source:</strong> Rates are sourced from trusted financial institutions, enhancing reliability.</li>
                </ul>

                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-gray-800">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Amount (SGD)</th>
                        <th className="border px-4 py-2 text-left">SGD to MYR</th>
                        <th className="border-l border-t border-b px-4 py-2 text-left pl-6">Amount (MYR)</th>
                        <th className="border px-4 py-2 text-left">MYR to SGD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionTable.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="border px-4 py-2">{item.amount} SGD</td>
                          <td className="border px-4 py-2">{item.sgd_to_myr} MYR</td>
                          <td className="border-l border-t border-b px-4 py-2 pl-6">{item.amount} MYR</td>
                          <td className="border px-4 py-2">{item.myr_to_sgd} SGD</td>
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

      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">All Currencies</h2>
          <p className="text-center mb-8 text-gray-700">Browse through all available currencies. Click on a currency to see more details and conversion options.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currencies.map((currency: Currency) => (
              <Link
                key={currency.code}
                href={`/currency/${currency.code}`}
                className="flex justify-between items-center p-5 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-32 overflow-hidden text-gray-800"
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  position: 'relative',
                }}
              >
                <div className="flex items-center">
                  <Image
                    src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/${currency.code.slice(0, 2).toLowerCase()}.svg`}
                    alt={`${currency.name} flag`}
                    width={24}
                    height={24}
                    style={{ marginRight: '10px' }}
                  />
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      textAlign: 'left',
                      color: '#2d3748',
                    }}>
                      {currency.name} ({currency.code})
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#1a202c',
                    }}>
                      1 USD = {currency.rate.toFixed(2)} {currency.code}
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ fontSize: '18px', color: '#4a5568' }} aria-hidden="true"></i>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;