import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../../services/api'; // Import the API function

export function TransactionForm({ transactions, onChange, voucherType }) {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch exchange rates when component mounts
  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        setLoading(false); // Set loading to false even in case of error
      }
    };

    getExchangeRates();
  }, []);

  // Helper function to get the correct exchange rate based on voucherType
  const getExchangeRate = (currency) => {
    const rate = exchangeRates.find((r) => r.currency_iso === currency);

    if (!rate) return 0;

    // Calculate exchange rate based on voucher type
    const exchangeRateForUnit = voucherType === 'remit-out'
      ? rate.sell_rate / rate.unit  // For 'remit-out', use the sell rate divided by the unit
      : rate.buy_rate / rate.unit;  // For 'remit-in', use the buy rate divided by the unit

    return exchangeRateForUnit;
  };

  const addTransaction = () => {
    onChange([
      ...transactions,
      {
        currency: '', // Initially set to empty, prompting the user to select a currency
        exchangeRate: 0, // Initially set to 0, will be updated when the user selects a currency
        fcyAmount: 0,
        nprAmount: 0,
        commission: voucherType === 'remit-out' ? 0 : undefined,
      },
    ]);
  };

  // Function to remove a transaction
  const removeTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    onChange(updatedTransactions);
  };

  const updateTransaction = (index, field, value) => {
    const updatedTransactions = transactions.map((t, i) => {
      if (i !== index) return t;

      const updated = { ...t, [field]: value };

      // Recalculate NPR amount when exchange rate or FCY amount changes
      if (field === 'exchangeRate' || field === 'fcyAmount' || field === 'currency') {
        updated.exchangeRate = getExchangeRate(updated.currency); // Recalculate exchange rate based on the currency
        updated.nprAmount = updated.exchangeRate * updated.fcyAmount; // Recalculate NPR amount
      }

      // Calculate commission for remit-in (0.5%)
      if (voucherType === 'remit-in' && (field === 'nprAmount' || field === 'fcyAmount')) {
        updated.commission = updated.nprAmount * 0.005;
      }

      return updated;
    });

    onChange(updatedTransactions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Currency Transactions</h3>
        <button
          type="button"
          onClick={addTransaction}
          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200"
        >
          Add Currency
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 items-end border p-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={transaction.currency}
                onChange={(e) => updateTransaction(index, 'currency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Currency</option> {/* Default option */}
                {loading ? (
                  <option>Loading...</option>
                ) : (
                  exchangeRates.map((rate) => (
                    <option key={rate.currency_iso} value={rate.currency_iso}>
                      {rate.currency_name} ({rate.currency_iso})
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
              <input
                type="number"
                value={transaction.exchangeRate || ''}
                onChange={(e) => updateTransaction(index, 'exchangeRate', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">FCY Amount</label>
              <input
                type="number"
                value={transaction.fcyAmount || ''}
                onChange={(e) => updateTransaction(index, 'fcyAmount', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NPR Amount</label>
              <input
                type="number"
                value={transaction.nprAmount || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            {voucherType === 'remit-in' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission (0.5%)</label>
                <input
                  type="number"
                  value={transaction.commission || ''}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeTransaction(index)} // Use the removeTransaction function
              className="bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
