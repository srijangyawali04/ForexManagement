import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';
import { Trash } from 'lucide-react';

export function TransactionForm({ transactions, onChange, voucherType }) {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth(); 
  const [commission, setCommission] = useState(0);  

  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
        setLoading(false); 
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        setLoading(false); 
      }
    };

    getExchangeRates();
  }, []);

  const getExchangeRate = (currency) => {
    const rate = exchangeRates.find((r) => r.currency_iso === currency);
    if (!rate) return 0;

    const exchangeRateForUnit = voucherType !== 'remit-in'
      ? rate.sell_rate / rate.unit 
      : rate.buy_rate / rate.unit; 

    return exchangeRateForUnit;
  };

  const isExchangeRateValid = exchangeRates.every(
    (rate) => new Date(rate.fetchedAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  );

  const addTransaction = () => {
    if (!isExchangeRateValid) {
      alert('Exchange rates are not up-to-date. Please refresh the rates and try again.');
      return; 
    }

    const newTransaction = {
      currency_name: '',              
      currency_iso_code: '',          
      exchange_rate: 0,               
      fc_amount: 0,                   
      commission: null,               
      NPR_amount: 0,                   
      created_by: authState.staffCode, 
      verified_by: 'Pending',         
      transaction_type: voucherType,  
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
      return; 
    }
  
    const updatedTransactions = transactions.map((t, i) => {
      if (i !== index) return t;
  
      const updated = { ...t, [field]: value };
  
      if (field === 'currency_iso_code') {
        const selectedRate = exchangeRates.find((rate) => rate.currency_iso === value);
        updated.currency_name = selectedRate?.currency_name || '';
        updated.currency_iso_code = selectedRate?.currency_iso || '';
        updated.exchange_rate = parseFloat(getExchangeRate(value).toFixed(2)); 
        updated.fc_amount = updated.fc_amount || 0; 
      }
  
      
      if (field === 'fc_amount' || field === 'exchange_rate') {
        updated.NPR_amount = parseFloat((updated.fc_amount * updated.exchange_rate || 0).toFixed(2)); 
      }
  
      if (field === 'commission') {
        updated.commission = parseFloat((value || 0).toFixed(2));
      }
  
      return updated;
    });
  
    onChange(updatedTransactions);
  };
  
  const applyCommission = (index) => {
    const updatedTransactions = transactions.map((transaction, i) => {
      if (i === index && voucherType === 'remit-in') {
        const newCommission = parseFloat((transaction.NPR_amount * 0.005).toFixed(2)); 
        return { ...transaction, commission: newCommission }; 
      }
      return transaction; 
    });
  
    onChange(updatedTransactions); 
  };
  
  
  return (
    <div className="space-y-4">
      <div className="flex justify-start items-center space-x-4">
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
                value={transaction.currency_iso_code} 
                onChange={(e) => updateTransaction(index, 'currency_iso_code', e.target.value)} 
                className="mt-1 block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                value={transaction.exchange_rate || ''} 
                readOnly
                className="mt-1 pl-2 block w-full h-9 rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">FC Amount</label>
              <input
                type="number"
                value={transaction.fc_amount || ''} 
                onChange={(e) => updateTransaction(index, 'fc_amount', parseFloat(e.target.value))} 
                className="mt-1 pl-2 block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount NRP</label>
              <input
                type="number"
                value={transaction.NPR_amount || ''} 
                readOnly
                className="mt-1 pl-2 block w-full h-9 rounded-md border-gray-300 bg-gray-50"
              />
            </div>

            {/* Commission Column */}
            {transaction.commission !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission</label>
                <input
                  type="number"
                  value={transaction.commission || ''} 
                  readOnly
                  className="mt-1 pl-2 block w-full h-9 rounded-md border-gray-300 bg-gray-50"
                />
              </div>
            )}

            {/* Apply Commission Button */}
            {voucherType === 'remit-in' && (
              <div>
                <button
                  type="button"
                  onClick={() => applyCommission(index)} 
                  className="bg-green-100 ml-auto text-green-700 h-9 px-4 py-2 rounded-md hover:bg-green-200"
                >
                  Apply Commission
                </button>

              </div>
            )}

            <button
              type="button"
              onClick={() => removeTransaction(index)} 
              className="bg-red-100 ml-auto  text-red-700 px-3 py-2 rounded-md hover:bg-red-200"
            >
              <Trash className="h-5 w-5 text-red-700" /> 
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
