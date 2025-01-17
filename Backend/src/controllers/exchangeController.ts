import axios from 'axios';
import { Request, Response } from 'express';
import { AppDataSource } from '../initializers/data-source';
import { ExchangeRate } from '../models/ExchangeRate';

export const fetchForexRates = async () => {
  const currentDate = new Date().toISOString().split('T')[0]; 
  const url = `https://www.nrb.org.np/api/forex/v1/rates?from=${currentDate}&to=${currentDate}&per_page=100&page=1`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const forexData = response.data.data.payload[0].rates;
      const forexRateRepo = AppDataSource.getRepository(ExchangeRate);

      for (const rate of forexData) {
        const existingRate = await forexRateRepo.findOneBy({
          currency_iso: rate.currency.iso3,
        });

        if (existingRate) {
          // Update existing rate
          existingRate.buy_rate = parseFloat(rate.buy);
          existingRate.sell_rate = parseFloat(rate.sell);
          existingRate.fetchedAt = new Date();
          await forexRateRepo.save(existingRate);
        } else {
          // Insert new rate
          const newRate = forexRateRepo.create({
            currency_iso: rate.currency.iso3,
            currency_name: rate.currency.name,
            buy_rate: parseFloat(rate.buy),
            sell_rate: parseFloat(rate.sell),
            unit: rate.currency.unit,
            fetchedAt: new Date(),
          });
          await forexRateRepo.save(newRate);
        }
      }

    }
  } catch (error) {
    console.error('Error fetching or processing forex rates:', error.message);
  }
};


// Endpoint to fetch all currencies with their rates
export const getAllCurrencies = async (req: Request, res: Response) => {
  try {
    const forexRateRepo = AppDataSource.getRepository(ExchangeRate);

    // Fetch all exchange rates
    const currencies = await forexRateRepo.find({
      select: ['currency_iso', 'currency_name','unit' ,'buy_rate', 'sell_rate','fetchedAt'],
    });

    if (currencies.length === 0) {
      return res.status(404).json({ message: 'No exchange rates found' });
    }

    res.status(200).json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
