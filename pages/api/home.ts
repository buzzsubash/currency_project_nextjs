import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCurrencies, getCurrencyByCode } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currencies = await getAllCurrencies();
    const sgdCurrency = await getCurrencyByCode('SGD');
    const myrCurrency = await getCurrencyByCode('MYR');
    const sgdToMyrRate = myrCurrency.rate / sgdCurrency.rate;

    const initialAmount = 1;
    const initialConversion = initialAmount * sgdToMyrRate;

    const currentTime = new Date();
    const day = currentTime.getDay();
    if (day === 0 || day === 6) {
      const offset = day === 0 ? 2 : 1;
      currentTime.setDate(currentTime.getDate() - offset);
      currentTime.setHours(23, 59, 59);
    }
    currentTime.setMinutes(currentTime.getMinutes() - (Math.floor(Math.random() * 2) + 3));

    const conversionAmounts = [1, 4, 11, 22, 55, 99, 490, 990, 2100, 4500, 5800, 9999];
    const conversionTable = conversionAmounts.map(amount => ({
      amount,
      sgd_to_myr: parseFloat((amount * sgdToMyrRate).toFixed(5)),
      myr_to_sgd: parseFloat((amount / sgdToMyrRate).toFixed(5)),
    }));

    res.status(200).json({
      currencies,
      initialAmount,
      initialConversion: parseFloat(initialConversion.toFixed(9)),
      fromCurrencyCode: sgdCurrency.code,
      toCurrencyCode: myrCurrency.code,
      sgdToMyrRate: parseFloat(sgdToMyrRate.toFixed(9)),
      updatedTime: currentTime.toISOString().replace('T', ' ').split('.')[0] + ' UTC',
      conversionTable,
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to fetch currency data' });
  }
}
