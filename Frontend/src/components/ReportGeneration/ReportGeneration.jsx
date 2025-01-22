import React, { useState , useEffect} from 'react';
import { Calendar, CalendarDays, DollarSign, FileText, FileSpreadsheet, X } from 'lucide-react';
import { fetchExchangeRates , fetchTransactionReport} from '../../services/api';

const VOUCHER_TYPES = [
  { code: 'all', name: 'All Types' },
  { code: 'remit-in', name: 'Remit In' },
  { code: 'remit-out', name: 'Remit Out' },
];

export const TransactionDateFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('today');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [currencies, setCurrencies] = useState([{ code: 'all', name: 'All Currencies' }]);
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedVoucherType, setSelectedVoucherType] = useState('all');
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const getCurrencyName = async () => {
      try {
        const rates = await fetchExchangeRates();
        
        // Transform the fetched rates to match the structure of the CURRENCIES array
        const currencyList = rates.map((rate) => ({
          code: rate.currency_iso,
          name: `${rate.currency_name} (${rate.currency_iso})`, // Use currency_name and currency_iso
        }));

        // Prepend the "All Currencies" option
        setCurrencies([{ code: 'all', name: 'All Currencies' }, ...currencyList]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        setLoading(false);
      }
    };

    getCurrencyName();
  }, []);

  useEffect(() => {
    if (transactionData) {
      console.log("Transaction Data Loaded:", transactionData);
    }
  }, [transactionData]);
  
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency,
      voucherType: selectedVoucherType,
    });
  };


  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    if (type === 'today') {
      const today = new Date().toISOString().split('T')[0];
      onFilterChange({
        dates: today,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    } else {
      onFilterChange({
        dates: dateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    if (filterType === 'specific') {
      onFilterChange({
        dates: newDateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };
  


  const handleVoucherTypeChange = (type) => {
    setSelectedVoucherType(type);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency: selectedCurrency,
      voucherType: type,
    });
  };

  const handleCreateReport = async () => {
    setLoading(true); // Set loading to true when the report is being fetched
    try {
      let filters = {};
  
      // Check if the "today" filter is selected
      if (filterType === 'today') {
        filters.today = true;
      } else {
        // Use date range if not 'today'
        filters.startDate = dateRange.startDate; // Assuming dateRange has a startDate and endDate property
        filters.endDate = dateRange.endDate;
      }
  
      // Include the currency filter if selected
      if (selectedCurrency && selectedCurrency !== 'all') {
        filters.currency = selectedCurrency;
      }
  
      // Include the transaction type if selected and it's not 'all'
      if (selectedVoucherType && selectedVoucherType !== 'all') {
        filters.transactionType = selectedVoucherType;
      }
  
      // Fetch the transaction report using the constructed filters
      const data = await fetchTransactionReport(filters);
      
      // Store the fetched data in state
      setTransactionData(data);
    } catch (error) {
      console.error('Error fetching transaction report:', error);
    } finally {
      setLoading(false); // Set loading to false after the data is fetched or if an error occurred
    }
  };
  
  
  

  const handleClearFilter = (type) => {
    if (type === 'currency') {
      handleCurrencyChange('all');
    } else {
      handleVoucherTypeChange('all');
    }
  };

  const getActiveFilters = () => {
    const filters = [];

    if (selectedCurrency !== 'all') {
      filters.push({
        type: 'currency',
        label: currencies.find((c) => c.code === selectedCurrency)?.name,
      });
    }

    if (selectedVoucherType !== 'all') {
      filters.push({
        type: 'voucherType',
        label: VOUCHER_TYPES.find((t) => t.code === selectedVoucherType)?.name,
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleFilterTypeChange('today')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'today' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Today
            </button>
            <button
              onClick={() => handleFilterTypeChange('specific')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'specific' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Specific Date
            </button>
          </div>

          {filterType === 'specific' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label htmlFor="currency" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4" />
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="voucherType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4" />
                Voucher Type
              </label>
              <select
                id="voucherType"
                value={selectedVoucherType}
                onChange={(e) => handleVoucherTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {VOUCHER_TYPES.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {activeFilters.map((filter) => (
                <div key={filter.type} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <span>{filter.label}</span>
                  <button onClick={() => handleClearFilter(filter.type)} className="p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateReport}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Temporary Report Display */}
      {showReport && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Transaction Report
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {transaction.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                          transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: transaction.currency,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {filteredTransactions
                        .reduce((acc, curr) => acc + curr.amount, 0)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: selectedCurrency === "all" ? "USD" : selectedCurrency,
                        })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filters.
            </div>
          )}
        </div>
      )}



    </div>
  );
};
