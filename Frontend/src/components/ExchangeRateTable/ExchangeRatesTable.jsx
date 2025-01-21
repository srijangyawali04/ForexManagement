import React, { useEffect, useState } from 'react';
import { fetchExchangeRates } from '../../services/api'; // Adjust the path

const ExchangeRatesTable = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates(); // This should be an API call fetching exchange rate data
        setExchangeRates(rates);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
        setError('Failed to load exchange rates. Please try again later.');
        setLoading(false);
      }
    };

    getExchangeRates();
  }, []);

  if (loading) {
    return <p>Loading exchange rates...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Exchange Rates</h2>
        </div>
        {/* Exchange Rates Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency ISO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fetched At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exchangeRates.map((rate, index) => {
                // Parse the buy_rate and sell_rate to ensure they are numbers before calling .toFixed()
                const buyRate = !isNaN(rate.buy_rate) ? parseFloat(rate.buy_rate).toFixed(4) : 'N/A';
                const sellRate = !isNaN(rate.sell_rate) ? parseFloat(rate.sell_rate).toFixed(4) : 'N/A';

                return (
                  <tr key={rate.currency_iso} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td> {/* SN */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.currency_iso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.currency_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{buyRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sellRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rate.fetchedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRatesTable;
