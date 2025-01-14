import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../../services/api'; // Import the API function
import { useAuth } from '../../contexts/AuthContext';

export function TransactionForm({ transactions, onChange, voucherType }) {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth(); // Access the authState from context

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
      ? rate.sell_rate / rate.unit // For 'remit-out', use the sell rate divided by the unit
      : rate.buy_rate / rate.unit; // For 'remit-in', use the buy rate divided by the unit

    return exchangeRateForUnit;
  };

  const addTransaction = () => {
    const newTransaction = {
      currency_name: '',              // Initially empty
      currency_iso_code: '',          // Initially empty
      exchange_rate: 0,               // Default exchange rate
      fc_amount: 0,                   // Default FCY amount
      commission: voucherType === 'remit-in' ? 0 : null,  // Commission for 'remit-in'
      total_NPR: 0,                   // Default Total NPR (sync with backend)
      created_by: authState.staffCode, // Current user
      verified_by: 'Pending',         // Default verification status
      transaction_type: voucherType,  // 'remit-in' or 'remit-out'
    };

    onChange([...transactions, newTransaction]);
  };

  const removeTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    onChange(updatedTransactions);
  };

  const updateTransaction = (index, field, value) => {
    const updatedTransactions = transactions.map((t, i) => {
      if (i !== index) return t;
  
      const updated = { ...t, [field]: value };
  
      // Handle updates for currency selection
      if (field === 'currency_iso_code') {
        const selectedRate = exchangeRates.find((rate) => rate.currency_iso === value);
        updated.currency_name = selectedRate?.currency_name || '';
        updated.currency_iso_code = selectedRate?.currency_iso || '';
        updated.exchange_rate = getExchangeRate(value); // Calculate exchange rate
        updated.fc_amount = updated.exchange_rate * (updated.fc_amount || 0); // Update FCY amount
      }
  
      // Recalculate the nprAmount based on fc_amount and exchange_rate
      if (field === 'fc_amount' || field === 'exchange_rate') {
        updated.nprAmount = updated.fc_amount * updated.exchange_rate || 0;
      }
  
      // Commission logic for 'remit-in' or 'remit-out'
      if (voucherType === 'remit-in' && (field === 'fc_amount' || field === 'nprAmount')) {
        if (updated.fc_amount > 0) {
          updated.commission = updated.fc_amount * 0.005 || 0;
        } else {
          updated.commission = 0; // Prevent NaN if fc_amount is 0 or invalid
        }
      } else if (voucherType === 'remit-out') {
        updated.commission = null; // Set commission to null for 'remit-out'
      }
  
      // Calculate total_NPR based on voucher type
      if (voucherType === 'remit-in') {
        updated.total_NPR = updated.nprAmount - updated.commission;
        console.log("fc_amount: ", updated.fc_amount);
        console.log("commission: ", updated.commission);
        console.log("total_NPR (remit-in): ", updated.total_NPR);
      } else if (voucherType === 'remit-out') {
        updated.total_NPR = updated.nprAmount; // For 'remit-out', total_NPR is equal to nprAmount
        console.log("total_NPR (remit-out): ", updated.total_NPR);
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
                value={transaction.currency_iso_code} // Use currency_iso_code
                onChange={(e) => updateTransaction(index, 'currency_iso_code', e.target.value)} // Update currency_iso_code
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
                value={transaction.exchange_rate || ''} // Default value for exchange_rate
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">FCY Amount</label>
              <input
                type="number"
                value={transaction.fc_amount || ''} // Default value for fc_amount
                onChange={(e) => updateTransaction(index, 'fc_amount', parseFloat(e.target.value))} // Ensure correct float parsing
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NPR Amount</label>
              <input
                type="number"
                value={transaction.nprAmount || ''} // Default value for fc_amount
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            {voucherType === 'remit-in' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission (0.5%)</label>
                <input
                  type="number"
                  value={transaction.commission || ''} // Default value for commission
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
