import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCurrencies, getCurrencyByCode } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Get all currencies or a specific currency by code
        const { code } = req.query;

        if (code && typeof code === 'string') {
          const currency = await getCurrencyByCode(code);
          if (!currency) {
            return res.status(404).json({ error: 'Currency not found' });
          }
          return res.status(200).json(currency);
        }

        const currencies = await getAllCurrencies();
        return res.status(200).json(currencies);
      } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Failed to fetch currency data' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}