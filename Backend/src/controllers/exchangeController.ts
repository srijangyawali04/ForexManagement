import axios from 'axios';
import { AppDataSource } from '../initializers/data-source';
import { ExchangeRate } from '../models/ExchangeRate';

const fetchForexRates = async () => {
  const currentDate = new Date().toISOString().split('T')[0]; 
  const url = `https://www.nrb.org.np/api/forex/v1/rates?from=${currentDate}&to=${currentDate}&per_page=100&page=1`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const forexData = response.data.data.payload[0].rates;
      const forexRateRepo = AppDataSource.getRepository(ExchangeRate);

      for (const rate of forexData) {
        const existingRate = await forexRateRepo.findOneBy({
          from_currency: rate.currency.iso3,
        });

        if (existingRate) {
          // Update existing rate
          existingRate.buy_rate = parseFloat(rate.buy);
          existingRate.sell_rate = parseFloat(rate.sell);
          existingRate.fetchedAt = new Date();
          await forexRateRepo.save(existingRate);
          console.log(`Updated rates for: ${rate.currency.name}`);
        } else {
          // Insert new rate
          const newRate = forexRateRepo.create({
            from_currency: rate.currency.iso3,
            currency_name: rate.currency.name,
            buy_rate: parseFloat(rate.buy),
            sell_rate: parseFloat(rate.sell),
            unit: rate.currency.unit,
            fetchedAt: new Date(),
          });
          await forexRateRepo.save(newRate);
          console.log(`Inserted new rates for: ${rate.currency.name}`);
        }
      }

      console.log('Forex rates processed successfully');
    }
  } catch (error) {
    console.error('Error fetching or processing forex rates:', error.message);
  }
};

export { fetchForexRates };
