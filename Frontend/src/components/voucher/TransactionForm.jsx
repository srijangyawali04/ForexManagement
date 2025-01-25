import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../../services/api'; // Import the API function
import { useAuth } from '../../contexts/AuthContext';

export function TransactionForm({ transactions, onChange, voucherType }) {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth(); // Access the authState from context
  const [commission, setCommission] = useState(0);  // Add commission state

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
    const exchangeRateForUnit = voucherType === 'remit-out' || 'staff-voucher'
      ? rate.sell_rate / rate.unit // For 'remit-out', use the sell rate divided by the unit
      : rate.buy_rate / rate.unit; // For 'remit-in', use the buy rate divided by the unit

    return exchangeRateForUnit;
  };

  // Check if exchange rates are up-to-date
  const isExchangeRateValid = exchangeRates.every(
    (rate) => new Date(rate.fetchedAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  );

  // Prevent adding a new transaction if exchange rates are not valid
  const addTransaction = () => {
    if (!isExchangeRateValid) {
      alert('Exchange rates are not up-to-date. Please refresh the rates and try again.');
      return; // Prevent adding a new transaction
    }

    const newTransaction = {
      currency_name: '',              // Initially empty
      currency_iso_code: '',          // Initially empty
      exchange_rate: 0,               // Default exchange rate
      fc_amount: 0,                   // Default FCY amount
      commission: null,               // Commission set to null by default
      NPR_amount: 0,                   // Default Total NPR (sync with backend)
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
    if (!isExchangeRateValid) {
      alert('Exchange rates are not up-to-date. Please refresh the rates and try again.');
      return; // Prevent updating the transaction if exchange rates are not valid
    }
  
    const updatedTransactions = transactions.map((t, i) => {
      if (i !== index) return t;
  
      const updated = { ...t, [field]: value };
  
      // Handle updates for currency selection
      if (field === 'currency_iso_code') {
        const selectedRate = exchangeRates.find((rate) => rate.currency_iso === value);
        updated.currency_name = selectedRate?.currency_name || '';
        updated.currency_iso_code = selectedRate?.currency_iso || '';
        updated.exchange_rate = parseFloat(getExchangeRate(value).toFixed(2)); // Limit exchange rate to 2 decimal places
        updated.fc_amount = updated.fc_amount || 0; // Keep FCY amount unchanged
      }
  
      // Recalculate the NPR amount and limit it to 2 decimal places
      if (field === 'fc_amount' || field === 'exchange_rate') {
        updated.NPR_amount = parseFloat((updated.fc_amount * updated.exchange_rate || 0).toFixed(2)); // Limit to 2 decimal places
      }
  
      // Limit the commission to 2 decimal places
      if (field === 'commission') {
        updated.commission = parseFloat((value || 0).toFixed(2));
      }
  
      return updated;
    });
  
    onChange(updatedTransactions);
  };
  
  // Set commission manually for a specific transaction
  const applyCommission = (index) => {
    const updatedTransactions = transactions.map((transaction, i) => {
      if (i === index && voucherType === 'remit-in') {
        // Calculate commission as 0.5% of NPR amount
        const newCommission = parseFloat((transaction.NPR_amount * 0.005).toFixed(2)); // Limit commission to 2 decimal places
        return { ...transaction, commission: newCommission }; // Update commission only for the selected transaction
      }
      return transaction; // Leave other transactions unchanged
    });
  
    onChange(updatedTransactions); // Update the transactions with the new commission
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
          <div key={index} className="grid grid-cols-7 gap-4 items-end border p-4 rounded-md">
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
              <label className="block text-sm font-medium text-gray-700">FC Amount</label>
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
              <label className="block text-sm font-medium text-gray-700">Amount NRP</label>
              <input
                type="number"
                value={transaction.NPR_amount || ''} // Default value for fc_amount
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>

            {/* Commission Column */}
            {transaction.commission !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission</label>
                <input
                  type="number"
                  value={transaction.commission || ''} // Display the manually set commission
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
            )}

            {/* Apply Commission Button */}
            {voucherType === 'remit-in' && (
              <div>
                <button
                  type="button"
                  onClick={() => applyCommission(index)} // Pass the index to apply commission for this specific transaction
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200"
                >
                  Apply Commission
                </button>

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
